import { useState, useCallback, useEffect } from "react";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigation,
  useBlocker,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Select,
  Button,
  Banner,
  ProgressBar,
  Badge,
  Box,
  Divider,
  Checkbox,
  Tag,
  Modal,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { generateProductDescription } from "~/services/ai.server";
import { type GenerateOptions, DEFAULT_GENERATE_OPTIONS } from "~/utils/generateOptions";
import { languageOptions } from "~/utils/languages";
import {
  checkUsageLimit,
  incrementUsage,
} from "~/services/billing.server";
import { getAllNiches } from "~/services/prompts.server";
import { getShop, markReviewClicked, dismissReviewBanner } from "~/models/shop.server";
import { createGeneration, markGenerationApplied, getGeneratedProductIds } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";
import {
  PRODUCTS_QUERY,
  parseProductsPageResponse,
  COLLECTIONS_QUERY,
  parseCollectionsResponse,
  PRODUCTS_BY_COLLECTION_QUERY,
  parseProductsByCollectionPageResponse,
} from "~/utils/shopify.server";
import { BulkProductPicker, type StatusFilter } from "~/components/BulkProductPicker";
import { hasPlanFeature, type PlanKey } from "~/utils/plans";
import type { ShopifyProduct, ShopifyCollection, PageInfo } from "~/types/shopify";

interface BulkResult {
  index: number;
  productId: string;
  productTitle: string;
  generationId: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  seoScore: number;
  suggestedTags: string[];
  applied: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  const usage = await checkUsageLimit(session.shop);
  const niches = getAllNiches();
  const brandVoice = await getBrandVoice(session.shop);

  let products: ShopifyProduct[] = [];
  let initialPageInfo: PageInfo = { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null };
  try {
    const response = await admin.graphql(PRODUCTS_QUERY, {
      variables: { first: 25 },
    });
    const responseJson = await response.json();
    const parsed = parseProductsPageResponse(responseJson);
    products = parsed.products;
    initialPageInfo = parsed.pageInfo;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  // Fetch collections
  let collections: ShopifyCollection[] = [];
  try {
    const collectionsResponse = await admin.graphql(COLLECTIONS_QUERY, {
      variables: { first: 50 },
    });
    const collectionsJson = await collectionsResponse.json();
    collections = parseCollectionsResponse(collectionsJson);
  } catch (error) {
    console.error("Failed to fetch collections:", error);
  }

  // Fetch generated product IDs
  const generatedProductIdsSet = await getGeneratedProductIds(session.shop);
  const generatedProductIds = Array.from(generatedProductIdsSet);

  const shop = await getShop(session.shop);
  const plan = (shop?.plan || "FREE") as PlanKey;
  const reviewBannerState = shop?.reviewBannerState ?? "pending";
  const hasGenerations = generatedProductIdsSet.size > 0;

  return json({ usage, niches, products, brandVoice, shop: session.shop, plan, reviewBannerState, hasGenerations, collections, generatedProductIds, initialPageInfo });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // --- Search products ---
  if (actionType === "searchProducts") {
    const query = (formData.get("query") as string) || "";
    const collectionId = (formData.get("collectionId") as string) || "";
    const after = (formData.get("after") as string) || undefined;
    const before = (formData.get("before") as string) || undefined;
    const direction = (formData.get("direction") as string) || "forward";

    // Build pagination variables
    const paginationVars: Record<string, any> = {};
    if (direction === "backward" && before) {
      paginationVars.last = 25;
      paginationVars.before = before;
    } else {
      paginationVars.first = 25;
      if (after) paginationVars.after = after;
    }

    try {
      let products: ShopifyProduct[] = [];
      let pageInfo: PageInfo = { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null };

      if (collectionId) {
        // Fetch products from specific collection
        const response = await admin.graphql(PRODUCTS_BY_COLLECTION_QUERY, {
          variables: {
            collectionId,
            ...paginationVars,
          },
        });
        const responseJson = await response.json();
        const parsed = parseProductsByCollectionPageResponse(responseJson);
        products = parsed.products;
        pageInfo = parsed.pageInfo;

        // Apply search filter locally if query provided
        if (query) {
          const lowerQuery = query.toLowerCase();
          products = products.filter((p) =>
            p.title.toLowerCase().includes(lowerQuery)
          );
        }
      } else {
        // Fetch all products with optional search
        const response = await admin.graphql(PRODUCTS_QUERY, {
          variables: {
            ...paginationVars,
            query: query ? `title:*${query}*` : null,
          },
        });
        const responseJson = await response.json();
        const parsed = parseProductsPageResponse(responseJson);
        products = parsed.products;
        pageInfo = parsed.pageInfo;
      }

      return json({ products, pageInfo });
    } catch (error) {
      console.error("Product search error:", error);
      return json({ products: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null } });
    }
  }

  // --- Review banner ---
  if (actionType === "reviewClick") {
    await markReviewClicked(session.shop);
    return json({ reviewBannerState: "clicked" });
  }

  if (actionType === "dismissReview") {
    await dismissReviewBanner(session.shop);
    return json({ reviewBannerState: "dismissed" });
  }

  // --- Apply selected results to Shopify ---
  if (actionType === "applySelected") {
    const itemsRaw = formData.get("items") as string;
    const applyOptionsRaw = formData.get("applyOptions") as string;

    if (!itemsRaw) {
      return json({ error: "No items to apply.", success: false, applyResult: true });
    }

    let applyOptions = DEFAULT_GENERATE_OPTIONS;
    if (applyOptionsRaw) {
      try {
        applyOptions = JSON.parse(applyOptionsRaw);
      } catch {
        // Use defaults
      }
    }

    let items: Array<{
      productId: string;
      title: string;
      description: string;
      metaTitle: string;
      metaDescription: string;
      tags: string[];
      generationId: string;
    }>;
    try {
      items = JSON.parse(itemsRaw);
    } catch {
      return json({ error: "Invalid items data.", success: false, applyResult: true });
    }

    const appliedIds: string[] = [];
    const errors: string[] = [];

    for (const item of items) {
      try {
        // Build input object with only the fields that should be applied
        const productInput: Record<string, any> = { id: item.productId };

        if (applyOptions.title && item.title) {
          productInput.title = item.title;
        }
        if (applyOptions.description && item.description) {
          productInput.descriptionHtml = item.description;
        }

        // Build SEO object only if meta fields should be applied
        if (applyOptions.metaTitle || applyOptions.metaDescription) {
          productInput.seo = {};
          if (applyOptions.metaTitle && item.metaTitle) {
            productInput.seo.title = item.metaTitle;
          }
          if (applyOptions.metaDescription && item.metaDescription) {
            productInput.seo.description = item.metaDescription;
          }
        }

        // Add tags if enabled
        if (applyOptions.tags && item.tags?.length > 0) {
          productInput.tags = item.tags;
        }

        const response = await admin.graphql(
          `
          mutation updateProduct($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                tags
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
          {
            variables: {
              input: productInput,
            },
          }
        );

        const responseJson = await response.json();
        const userErrors = responseJson?.data?.productUpdate?.userErrors;
        if (userErrors && userErrors.length > 0) {
          errors.push(
            `${item.title}: ${userErrors.map((e: any) => e.message).join(", ")}`
          );
          continue;
        }

        if (item.generationId) {
          try {
            await markGenerationApplied(item.generationId);
          } catch {
            // Non-fatal
          }
        }

        appliedIds.push(item.productId);
      } catch (error) {
        errors.push(`${item.title}: Failed to update`);
      }
    }

    return json({
      success: true,
      applyResult: true,
      appliedCount: appliedIds.length,
      appliedIds,
      errors,
    });
  }

  // --- Generate descriptions (default) ---
  const usage = await checkUsageLimit(session.shop);
  const shop = await getShop(session.shop);
  const brandVoice = await getBrandVoice(session.shop);

  const niche = formData.get("niche") as string;
  const tone = formData.get("tone") as string;
  const language = formData.get("language") as string;
  const generateOptionsRaw = formData.get("generateOptions") as string;

  let generateOptions = DEFAULT_GENERATE_OPTIONS;
  if (generateOptionsRaw) {
    try {
      generateOptions = JSON.parse(generateOptionsRaw);
    } catch {
      // Use defaults
    }
  }

  // Try Shopify product selection first, then fall back to textarea
  const selectedProductsRaw = formData.get("selectedProducts") as string;
  const productsTextRaw = formData.get("products") as string;

  interface ProductInput {
    productId: string;
    productTitle: string;
    productType?: string;
    features?: string[];
    existingDescription?: string;
    tags?: string[];
  }

  let productInputs: ProductInput[] = [];

  if (selectedProductsRaw) {
    try {
      const parsed: ShopifyProduct[] = JSON.parse(selectedProductsRaw);
      productInputs = parsed.map((p) => ({
        productId: p.id,
        productTitle: p.title,
        productType: p.productType || undefined,
        features: p.tags.length > 0 ? p.tags : undefined,
        existingDescription: p.descriptionHtml || undefined,
        tags: p.tags,
      }));
    } catch {
      return json({ error: "Invalid product selection data.", success: false });
    }
  } else if (productsTextRaw?.trim()) {
    const lines = productsTextRaw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    productInputs = lines.map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        productId: "",
        productTitle: parts[0],
        productType: parts[1] || undefined,
        features: parts[2]
          ? parts[2].split(",").map((f) => f.trim())
          : undefined,
      };
    });
  }

  if (productInputs.length === 0) {
    return json({ error: "Please select or enter at least one product.", success: false });
  }

  const remaining = Math.max(0, usage.limit - usage.used);
  if (remaining === 0 || productInputs.length > remaining) {
    return json({
      error: remaining === 0
        ? "You've reached your monthly limit. Upgrade your plan for more descriptions."
        : `You can only generate ${remaining} more descriptions this month. You selected ${productInputs.length} products.`,
      success: false,
    });
  }

  const results: BulkResult[] = [];
  const errors: string[] = [];

  for (let i = 0; i < productInputs.length; i++) {
    const input = productInputs[i];

    if (!input.productTitle) {
      errors.push("Skipped empty product");
      continue;
    }

    try {
      const result = await generateProductDescription({
        productTitle: input.productTitle,
        productType: input.productType,
        features: input.features,
        existingDescription: input.existingDescription,
        niche,
        tone,
        language,
        brandVoice: brandVoice
          ? {
              tone: brandVoice.tone || undefined,
              style: brandVoice.style || undefined,
              customPrompt: brandVoice.customPrompt || undefined,
              sampleTexts: brandVoice.sampleTexts || undefined,
              keywords: brandVoice.keywords || undefined,
              avoidWords: brandVoice.avoidWords || undefined,
            }
          : undefined,
        generateOptions,
      });

      let generationId = "";
      if (shop) {
        const generation = await createGeneration({
          shopId: shop.id,
          productId: input.productId || undefined,
          productTitle: input.productTitle,
          productType: input.productType,
          niche,
          tone,
          keywords: [],
          title: result.title,
          description: result.description,
          metaTitle: result.metaTitle,
          metaDescription: result.metaDescription,
          seoScore: result.seoScore,
          tokensUsed: result.tokensUsed,
          generationTime: result.generationTime,
        });
        generationId = generation.id;
      }

      await incrementUsage(session.shop);

      results.push({
        index: i,
        productId: input.productId,
        productTitle: input.productTitle,
        generationId,
        title: result.title,
        description: result.description,
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        seoScore: result.seoScore,
        suggestedTags: result.suggestedTags || [],
        applied: false,
      });
    } catch (error) {
      errors.push(`Failed: ${input.productTitle}`);
    }

    // Small delay between requests
    if (i < productInputs.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return json({
    success: true,
    results,
    errors,
    total: productInputs.length,
    completed: results.length,
    generateOptions,
  });
}

export default function BulkPage() {
  const { usage, niches, products, brandVoice, plan, reviewBannerState, hasGenerations, collections, generatedProductIds, initialPageInfo } = useLoaderData<typeof loader>();
  const canUseBulk = hasPlanFeature(plan as PlanKey, "bulk");
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  // Convert array back to Set for efficient lookup
  const generatedProductIdsSet = new Set(generatedProductIds);

  const isProcessing =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") !== "searchProducts" &&
    navigation.formData?.get("_action") !== "applySelected";

  const isApplying =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "applySelected";

  // Block navigation while generating
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isProcessing && currentLocation.pathname !== nextLocation.pathname
  );

  // Block browser refresh/close while generating
  useEffect(() => {
    if (!isProcessing) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isProcessing]);

  // Input mode toggle
  const [inputMode, setInputMode] = useState<"picker" | "manual">("picker");

  // Picker state
  const [selectedProducts, setSelectedProducts] = useState<ShopifyProduct[]>([]);

  // Filter state
  const [selectedCollection, setSelectedCollection] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Generate options state
  const [generateOptions, setGenerateOptions] = useState<GenerateOptions>({
    ...DEFAULT_GENERATE_OPTIONS,
  });

  // Manual textarea state
  const [productsText, setProductsText] = useState("");

  // Settings
  const [niche, setNiche] = useState("general");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");

  // Results state
  const [checkedResults, setCheckedResults] = useState<Set<number>>(new Set());
  const [appliedResults, setAppliedResults] = useState<Set<number>>(new Set());
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  // When results arrive, check all by default
  const results: BulkResult[] = actionData?.results || [];
  const hasResults = actionData?.success && results.length > 0 && !actionData?.applyResult;

  // Initialize checked set when results change
  const [lastResultsKey, setLastResultsKey] = useState("");
  const resultsKey = results.map((r: BulkResult) => r.generationId).join(",");
  if (hasResults && resultsKey !== lastResultsKey) {
    const allIndices = new Set(results.map((_: BulkResult, i: number) => i));
    setCheckedResults(allIndices);
    setAppliedResults(new Set());
    setLastResultsKey(resultsKey);
    setShowApplyConfirm(false);
  }

  // Handle apply result
  if (actionData?.applyResult && actionData?.success && actionData?.appliedIds) {
    const newApplied = new Set(appliedResults);
    for (const result of results) {
      if (actionData.appliedIds.includes(result.productId)) {
        newApplied.add(result.index);
      }
    }
    if (newApplied.size !== appliedResults.size) {
      setAppliedResults(newApplied);
      setShowApplyConfirm(false);
    }
  }

  const remaining = Math.max(0, usage.limit - usage.used);

  const productCount =
    inputMode === "picker"
      ? selectedProducts.length
      : productsText.split("\n").filter((l) => l.trim()).length;

  const MAX_BULK_SELECTION = 25;

  const handleToggleProduct = useCallback((product: ShopifyProduct) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= MAX_BULK_SELECTION) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const handleSelectMany = useCallback((productsToAdd: ShopifyProduct[]) => {
    setSelectedProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newProducts = productsToAdd.filter((p) => !existingIds.has(p.id));
      const slotsAvailable = MAX_BULK_SELECTION - prev.length;
      if (slotsAvailable <= 0) return prev;
      return [...prev, ...newProducts.slice(0, slotsAvailable)];
    });
  }, []);

  const handleDeselectMany = useCallback((productIds: string[]) => {
    const idsToRemove = new Set(productIds);
    setSelectedProducts((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
  }, []);

  const handleGenerate = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "generate");
    formData.append("niche", niche);
    formData.append("tone", tone);
    formData.append("language", language);
    formData.append("generateOptions", JSON.stringify(generateOptions));

    if (inputMode === "picker") {
      formData.append("selectedProducts", JSON.stringify(selectedProducts));
    } else {
      formData.append("products", productsText);
    }

    submit(formData, { method: "post" });
  }, [inputMode, selectedProducts, productsText, niche, tone, language, generateOptions, submit]);

  const handleToggleCheck = useCallback((index: number) => {
    setCheckedResults((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!hasResults) return;
    const unapplied = results
      .map((_: BulkResult, i: number) => i)
      .filter((i: number) => !appliedResults.has(i));
    setCheckedResults(new Set(unapplied));
  }, [hasResults, results, appliedResults]);

  const handleDeselectAll = useCallback(() => {
    setCheckedResults(new Set());
  }, []);

  const checkedCount = [...checkedResults].filter(
    (i) => !appliedResults.has(i)
  ).length;

  const handleApplyClick = useCallback(() => {
    setShowApplyConfirm(true);
  }, []);

  const handleApplyConfirm = useCallback(() => {
    const itemsToApply = results
      .filter(
        (_: BulkResult, i: number) => checkedResults.has(i) && !appliedResults.has(i)
      )
      .filter((r: BulkResult) => r.productId)
      .map((r: BulkResult) => ({
        productId: r.productId,
        title: r.title,
        description: r.description,
        metaTitle: r.metaTitle,
        metaDescription: r.metaDescription,
        tags: r.suggestedTags || [],
        generationId: r.generationId,
      }));

    if (itemsToApply.length === 0) return;

    const formData = new FormData();
    formData.append("_action", "applySelected");
    formData.append("items", JSON.stringify(itemsToApply));
    // Pass the generate options so we know what to apply
    if (actionData?.generateOptions) {
      formData.append("applyOptions", JSON.stringify(actionData.generateOptions));
    }
    submit(formData, { method: "post" });
  }, [results, checkedResults, appliedResults, actionData, submit]);

  const currentBannerState = actionData?.reviewBannerState || reviewBannerState;
  const showReviewBanner = hasGenerations && currentBannerState !== "dismissed";

  const handleLeaveReview = useCallback(() => {
    window.open("https://apps.shopify.com/inkbot/reviews#modal-show=WriteReviewModal", "_blank");
    const formData = new FormData();
    formData.append("_action", "reviewClick");
    submit(formData, { method: "post" });
  }, [submit]);

  const handleOpenReviewPage = useCallback(() => {
    window.open("https://apps.shopify.com/inkbot/reviews#modal-show=WriteReviewModal", "_blank");
  }, []);

  const handleDismissReview = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "dismissReview");
    submit(formData, { method: "post" });
  }, [submit]);

  const handleCopyAll = useCallback(() => {
    if (!results.length) return;
    const text = results
      .map(
        (r: BulkResult) =>
          `## ${r.productTitle}\n\nTitle: ${r.title}\n\n${r.description}\n\nMeta Title: ${r.metaTitle}\nMeta Description: ${r.metaDescription}\nSEO Score: ${r.seoScore}/100`
      )
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
  }, [results]);

  const nicheOptions = niches.map((n: any) => ({
    label: `${n.icon} ${n.displayName}`,
    value: n.name,
  }));

  // Check if any checked results lack a productId (manual input)
  const hasManualResults =
    hasResults &&
    results.some(
      (r: BulkResult, i: number) => checkedResults.has(i) && !r.productId
    );

  return (
    <Page
      title="Bulk Generate"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Review Banner */}
            {showReviewBanner && currentBannerState === "pending" && (
              <Banner
                title="Enjoying InkBot?"
                tone="info"
                action={{
                  content: "Leave a Review",
                  onAction: handleLeaveReview,
                }}
              >
                <p>If you're finding InkBot helpful, a quick review would mean a lot.</p>
              </Banner>
            )}
            {showReviewBanner && currentBannerState === "clicked" && (
              <Banner
                title="Thank you!"
                tone="success"
                action={{
                  content: "I left a review",
                  onAction: handleDismissReview,
                }}
                secondaryAction={{
                  content: "No thanks, dismiss",
                  onAction: handleDismissReview,
                }}
              >
                <BlockStack gap="200">
                  <p>Did you have a chance to leave a review? Either way, thanks for using InkBot!</p>
                  <InlineStack>
                    <Button variant="plain" onClick={handleOpenReviewPage}>
                      Take me back to the review page
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Banner>
            )}

            {/* Plan gate */}
            {!canUseBulk && (
              <Banner tone="warning" title="Upgrade Required">
                <p>
                  Bulk generation is available on Starter plan and above.{" "}
                  <Button variant="plain" url="/app/billing">
                    Upgrade your plan
                  </Button>
                </p>
              </Banner>
            )}

            {/* Usage warning */}
            {remaining <= 0 && (
              <Banner tone="warning" title="No Generations Remaining">
                <p>
                  Upgrade your plan to generate more descriptions.{" "}
                  <Button variant="plain" url="/app/billing">
                    View plans
                  </Button>
                </p>
              </Banner>
            )}

            {/* Error */}
            {actionData && !actionData.success && actionData.error && !actionData.applyResult && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            {/* Apply errors */}
            {actionData?.applyResult && actionData?.errors?.length > 0 && (
              <Banner tone="warning" title="Some products failed to update">
                <p>{actionData.errors.join("; ")}</p>
              </Banner>
            )}

            {/* Apply success */}
            {actionData?.applyResult && actionData?.success && actionData?.appliedCount > 0 && (
              <Banner tone="success" title="Products Updated">
                <p>
                  Successfully applied descriptions to {actionData.appliedCount} product
                  {actionData.appliedCount !== 1 ? "s" : ""} in your Shopify store.
                </p>
              </Banner>
            )}

            {/* Step 1: Select Products */}
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">
                    1. Select Products
                  </Text>
                  <InlineStack gap="200">
                    <Button
                      variant={inputMode === "picker" ? "primary" : "tertiary"}
                      size="slim"
                      onClick={() => setInputMode("picker")}
                    >
                      From Store
                    </Button>
                    <Button
                      variant={inputMode === "manual" ? "primary" : "tertiary"}
                      size="slim"
                      onClick={() => setInputMode("manual")}
                    >
                      Enter Manually
                    </Button>
                  </InlineStack>
                </InlineStack>

                {inputMode === "picker" ? (
                  <BulkProductPicker
                    products={products}
                    selectedProducts={selectedProducts}
                    onToggle={handleToggleProduct}
                    onClearAll={handleClearAll}
                    onSelectMany={handleSelectMany}
                    onDeselectMany={handleDeselectMany}
                    collections={collections}
                    generatedProductIds={generatedProductIdsSet}
                    selectedCollection={selectedCollection}
                    onCollectionChange={setSelectedCollection}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    initialPageInfo={initialPageInfo}
                    maxSelection={MAX_BULK_SELECTION}
                  />
                ) : (
                  <BlockStack gap="300">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Enter one product per line. Format:{" "}
                      <strong>
                        Product Title | Product Type | Features (comma-separated)
                      </strong>
                    </Text>
                    <TextField
                      label="Product List"
                      value={productsText}
                      onChange={setProductsText}
                      multiline={10}
                      autoComplete="off"
                      placeholder={
                        "Premium Wireless Headphones | Headphones | Noise cancellation, 40h battery, Bluetooth 5.3\nOrganic Cotton T-Shirt | T-Shirt | 100% organic, breathable, unisex\nVitamin C Serum | Skincare | 20% vitamin C, hyaluronic acid, anti-aging"
                      }
                    />
                  </BlockStack>
                )}

                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">
                    {productCount} product{productCount !== 1 ? "s" : ""}{" "}
                    {inputMode === "picker" ? "selected" : "entered"}
                    {" \u00B7 "}
                    {remaining} generations remaining
                  </Text>
                  {productCount > remaining && remaining > 0 && (
                    <Badge tone="warning">
                      {`Only ${remaining} will be processed`}
                    </Badge>
                  )}
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Step 2: Settings */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  2. Generation Settings (applied to all)
                </Text>

                {/* What to generate */}
                <BlockStack gap="200">
                  <Text as="span" variant="bodySm" fontWeight="semibold">
                    What to generate
                  </Text>
                  <InlineStack gap="400" wrap>
                    <Checkbox
                      label="Title"
                      checked={generateOptions.title}
                      onChange={(checked) =>
                        setGenerateOptions((prev) => ({ ...prev, title: checked }))
                      }
                    />
                    <Checkbox
                      label="Description"
                      checked={generateOptions.description}
                      onChange={(checked) =>
                        setGenerateOptions((prev) => ({ ...prev, description: checked }))
                      }
                    />
                    <Checkbox
                      label="Meta Title"
                      checked={generateOptions.metaTitle}
                      onChange={(checked) =>
                        setGenerateOptions((prev) => ({ ...prev, metaTitle: checked }))
                      }
                    />
                    <Checkbox
                      label="Meta Description"
                      checked={generateOptions.metaDescription}
                      onChange={(checked) =>
                        setGenerateOptions((prev) => ({ ...prev, metaDescription: checked }))
                      }
                    />
                    <Checkbox
                      label="Tags"
                      checked={generateOptions.tags}
                      onChange={(checked) =>
                        setGenerateOptions((prev) => ({ ...prev, tags: checked }))
                      }
                    />
                  </InlineStack>
                </BlockStack>

                <InlineStack gap="400" wrap>
                  <Box minWidth="180px">
                    <Select
                      label="Niche"
                      options={nicheOptions}
                      value={niche}
                      onChange={setNiche}
                    />
                  </Box>
                  <Box minWidth="180px">
                    <Select
                      label="Tone"
                      options={[
                        { label: "Professional", value: "professional" },
                        { label: "Casual & Friendly", value: "casual" },
                        { label: "Luxurious", value: "luxurious" },
                        { label: "Playful", value: "playful" },
                        { label: "Technical", value: "technical" },
                        { label: "Minimalist", value: "minimalist" },
                      ]}
                      value={tone}
                      onChange={setTone}
                    />
                  </Box>
                  <Box minWidth="180px">
                    <Select
                      label="Language"
                      options={languageOptions}
                      value={language}
                      onChange={setLanguage}
                    />
                  </Box>
                </InlineStack>

                {brandVoice && (
                  <Banner tone="info">
                    <p>
                      Brand voice is configured. Tone:{" "}
                      <strong>{brandVoice.tone}</strong>, Style:{" "}
                      <strong>{brandVoice.style}</strong>.{" "}
                      <Button variant="plain" url="/app/settings">
                        Edit
                      </Button>
                    </p>
                  </Banner>
                )}
              </BlockStack>
            </Card>

            {/* Generate Button */}
            <InlineStack align="end">
              <Button
                variant="primary"
                size="large"
                onClick={handleGenerate}
                disabled={productCount === 0 || isProcessing || remaining <= 0 || !canUseBulk}
                loading={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Generate ${Math.min(productCount, remaining)} Description${Math.min(productCount, remaining) !== 1 ? "s" : ""}`}
              </Button>
            </InlineStack>

            {/* Progress indicator while processing */}
            {isProcessing && (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Processing...
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Generating descriptions for {productCount} products. This
                    may take a moment.
                  </Text>
                  <ProgressBar progress={50} tone="primary" />
                </BlockStack>
              </Card>
            )}

            {/* Step 3: Results */}
            {hasResults && (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="100">
                        <Text as="h2" variant="headingMd">
                          3. Results
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {actionData.completed} / {actionData.total} completed
                          {actionData.errors?.length > 0 &&
                            ` (${actionData.errors.length} failed)`}
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200">
                        <Button onClick={handleCopyAll} size="slim">
                          Copy All
                        </Button>
                      </InlineStack>
                    </InlineStack>

                    {/* Select/Deselect + Apply */}
                    <Divider />
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200">
                        <Button
                          variant="plain"
                          size="slim"
                          onClick={handleSelectAll}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="plain"
                          size="slim"
                          onClick={handleDeselectAll}
                        >
                          Deselect All
                        </Button>
                      </InlineStack>
                      {checkedCount > 0 && !hasManualResults && (
                        <Button
                          variant="primary"
                          size="slim"
                          onClick={handleApplyClick}
                          loading={isApplying}
                          disabled={showApplyConfirm}
                        >
                          {`Apply Selected (${checkedCount})`}
                        </Button>
                      )}
                    </InlineStack>
                  </BlockStack>
                </Card>

                {/* Apply confirmation */}
                {showApplyConfirm && (
                  <Banner tone="warning" title="Confirm changes">
                    <BlockStack gap="200">
                      <p>
                        This will update {checkedCount} product
                        {checkedCount !== 1 ? "s" : ""} in your Shopify store:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {actionData.generateOptions?.title !== false && (
                          <li>Product title</li>
                        )}
                        {actionData.generateOptions?.description !== false && (
                          <li>Product description</li>
                        )}
                        {actionData.generateOptions?.metaTitle !== false && (
                          <li>SEO meta title</li>
                        )}
                        {actionData.generateOptions?.metaDescription !== false && (
                          <li>SEO meta description</li>
                        )}
                        {actionData.generateOptions?.tags && (
                          <li>Product tags (added to existing)</li>
                        )}
                      </ul>
                      <InlineStack gap="200">
                        <Button
                          variant="primary"
                          onClick={handleApplyConfirm}
                          loading={isApplying}
                        >
                          Confirm & Apply
                        </Button>
                        <Button
                          variant="plain"
                          onClick={() => setShowApplyConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Banner>
                )}

                {actionData.errors?.length > 0 && (
                  <Banner tone="warning">
                    <p>
                      Some products failed: {actionData.errors.join(", ")}
                    </p>
                  </Banner>
                )}

                {/* Result cards */}
                {results.map((result: BulkResult, i: number) => {
                  const isChecked = checkedResults.has(i);
                  const isApplied = appliedResults.has(i);
                  return (
                    <Card key={result.generationId || i}>
                      <BlockStack gap="300">
                        <InlineStack
                          align="space-between"
                          blockAlign="center"
                        >
                          <InlineStack gap="300" blockAlign="center">
                            {result.productId && !isApplied && (
                              <Checkbox
                                label=""
                                labelHidden
                                checked={isChecked}
                                onChange={() => handleToggleCheck(i)}
                              />
                            )}
                            <Text as="h3" variant="headingSm">
                              {result.productTitle}
                            </Text>
                          </InlineStack>
                          <InlineStack gap="200">
                            {isApplied && (
                              <Badge tone="success">Applied</Badge>
                            )}
                            <Badge
                              tone={
                                result.seoScore >= 80
                                  ? "success"
                                  : result.seoScore >= 60
                                    ? "warning"
                                    : "critical"
                              }
                            >
                              {`SEO: ${result.seoScore}/100`}
                            </Badge>
                          </InlineStack>
                        </InlineStack>

                        {actionData.generateOptions?.title !== false && result.title && (
                          <Text as="p" variant="bodySm">
                            <strong>Title:</strong> {result.title}
                          </Text>
                        )}

                        {actionData.generateOptions?.description !== false && result.description && (
                          <Box
                            padding="300"
                            background="bg-surface-secondary"
                            borderRadius="200"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: result.description,
                              }}
                            />
                          </Box>
                        )}

                        {(actionData.generateOptions?.metaTitle !== false && result.metaTitle) ||
                         (actionData.generateOptions?.metaDescription !== false && result.metaDescription) ? (
                          <Text as="p" variant="bodySm">
                            <strong>Meta:</strong>{" "}
                            {actionData.generateOptions?.metaTitle !== false && result.metaTitle}
                            {actionData.generateOptions?.metaTitle !== false && result.metaTitle &&
                             actionData.generateOptions?.metaDescription !== false && result.metaDescription && " — "}
                            {actionData.generateOptions?.metaDescription !== false && result.metaDescription}
                          </Text>
                        ) : null}

                        {actionData.generateOptions?.tags && result.suggestedTags?.length > 0 && (
                          <InlineStack gap="200" wrap>
                            {result.suggestedTags.map(
                              (tag: string, ki: number) => (
                                <Tag key={ki}>{tag}</Tag>
                              )
                            )}
                          </InlineStack>
                        )}
                      </BlockStack>
                    </Card>
                  );
                })}
              </BlockStack>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>

      {blocker.state === "blocked" && (
        <Modal
          open
          onClose={() => blocker.reset()}
          title="Generation in progress"
          primaryAction={{
            content: "Stay on page",
            onAction: () => blocker.reset(),
          }}
          secondaryActions={[
            {
              content: "Leave anyway",
              destructive: true,
              onAction: () => blocker.proceed(),
            },
          ]}
        >
          <Modal.Section>
            <Text as="p">
              Descriptions are still being generated. If you leave now, the process will stop and incomplete results will be lost.
            </Text>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}
