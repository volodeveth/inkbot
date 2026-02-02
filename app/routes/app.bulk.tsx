import { useState, useCallback } from "react";
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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { generateProductDescription } from "~/services/ai.server";
import {
  checkUsageLimit,
  incrementUsage,
} from "~/services/billing.server";
import { getAllNiches } from "~/services/prompts.server";
import { getShop, markReviewLeft } from "~/models/shop.server";
import { createGeneration, markGenerationApplied } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";
import { PRODUCTS_QUERY, parseProductsResponse } from "~/utils/shopify.server";
import { BulkProductPicker } from "~/components/BulkProductPicker";
import { hasPlanFeature, type PlanKey } from "~/utils/plans";
import type { ShopifyProduct } from "~/types/shopify";

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
  suggestedKeywords: string[];
  applied: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  const usage = await checkUsageLimit(session.shop);
  const niches = getAllNiches();
  const brandVoice = await getBrandVoice(session.shop);

  let products: ShopifyProduct[] = [];
  try {
    const response = await admin.graphql(PRODUCTS_QUERY, {
      variables: { first: 25 },
    });
    const responseJson = await response.json();
    products = parseProductsResponse(responseJson);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const shop = await getShop(session.shop);
  const plan = (shop?.plan || "FREE") as PlanKey;
  const reviewLeft = shop?.reviewLeft ?? false;

  return json({ usage, niches, products, brandVoice, shop: session.shop, plan, reviewLeft });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // --- Search products ---
  if (actionType === "searchProducts") {
    const query = (formData.get("query") as string) || "";
    try {
      const response = await admin.graphql(PRODUCTS_QUERY, {
        variables: {
          first: 25,
          query: query ? `title:*${query}*` : null,
        },
      });
      const responseJson = await response.json();
      const products = parseProductsResponse(responseJson);
      return json({ products });
    } catch (error) {
      console.error("Product search error:", error);
      return json({ products: [] });
    }
  }

  // --- Leave review ---
  if (actionType === "leaveReview") {
    await markReviewLeft(session.shop);
    return json({ reviewLeft: true });
  }

  // --- Apply selected results to Shopify ---
  if (actionType === "applySelected") {
    const itemsRaw = formData.get("items") as string;
    if (!itemsRaw) {
      return json({ error: "No items to apply.", success: false, applyResult: true });
    }

    let items: Array<{
      productId: string;
      title: string;
      description: string;
      metaTitle: string;
      metaDescription: string;
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
        const response = await admin.graphql(
          `
          mutation updateProduct($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
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
              input: {
                id: item.productId,
                title: item.title,
                descriptionHtml: item.description,
                seo: {
                  title: item.metaTitle || item.title,
                  description: item.metaDescription || "",
                },
              },
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
        suggestedKeywords: result.suggestedKeywords || [],
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
  });
}

export default function BulkPage() {
  const { usage, niches, products, brandVoice, plan, reviewLeft } = useLoaderData<typeof loader>();
  const canUseBulk = hasPlanFeature(plan as PlanKey, "bulk");
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isProcessing =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") !== "searchProducts" &&
    navigation.formData?.get("_action") !== "applySelected";

  const isApplying =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "applySelected";

  // Input mode toggle
  const [inputMode, setInputMode] = useState<"picker" | "manual">("picker");

  // Picker state
  const [selectedProducts, setSelectedProducts] = useState<ShopifyProduct[]>([]);

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

  const handleToggleProduct = useCallback((product: ShopifyProduct) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const handleGenerate = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "generate");
    formData.append("niche", niche);
    formData.append("tone", tone);
    formData.append("language", language);

    if (inputMode === "picker") {
      formData.append("selectedProducts", JSON.stringify(selectedProducts));
    } else {
      formData.append("products", productsText);
    }

    submit(formData, { method: "post" });
  }, [inputMode, selectedProducts, productsText, niche, tone, language, submit]);

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
        generationId: r.generationId,
      }));

    if (itemsToApply.length === 0) return;

    const formData = new FormData();
    formData.append("_action", "applySelected");
    formData.append("items", JSON.stringify(itemsToApply));
    submit(formData, { method: "post" });
  }, [results, checkedResults, appliedResults, submit]);

  const handleLeaveReview = useCallback(() => {
    window.open("https://apps.shopify.com/describely/reviews#modal-show=WriteReviewModal", "_blank");
    const formData = new FormData();
    formData.append("_action", "leaveReview");
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
            {!reviewLeft && !actionData?.reviewLeft && (
              <Banner
                title="Enjoying Describely?"
                tone="info"
                action={{
                  content: "Leave a Review",
                  onAction: handleLeaveReview,
                }}
              >
                <p>If you're finding Describely helpful, a quick review would mean a lot.</p>
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
                      options={[
                        // Priority
                        { label: "English", value: "en" },
                        { label: "French", value: "fr" },
                        { label: "German", value: "de" },
                        { label: "Spanish", value: "es" },
                        { label: "Portuguese", value: "pt" },
                        { label: "Ukrainian", value: "uk" },
                        // Alphabetical
                        { label: "Afrikaans", value: "af" },
                        { label: "Amharic", value: "am" },
                        { label: "Arabic", value: "ar" },
                        { label: "Arabic (North African)", value: "ar-na" },
                        { label: "Bengali", value: "bn" },
                        { label: "Chinese", value: "zh" },
                        { label: "Czech", value: "cs" },
                        { label: "Danish", value: "da" },
                        { label: "Dutch", value: "nl" },
                        { label: "Filipino", value: "tl" },
                        { label: "Finnish", value: "fi" },
                        { label: "French (African)", value: "fr-af" },
                        { label: "Greek", value: "el" },
                        { label: "Hausa", value: "ha" },
                        { label: "Hebrew", value: "he" },
                        { label: "Hindi", value: "hi" },
                        { label: "Hungarian", value: "hu" },
                        { label: "Igbo", value: "ig" },
                        { label: "Indonesian", value: "id" },
                        { label: "Italian", value: "it" },
                        { label: "Japanese", value: "ja" },
                        { label: "Korean", value: "ko" },
                        { label: "Malay", value: "ms" },
                        { label: "Norwegian", value: "no" },
                        { label: "Oromo", value: "om" },
                        { label: "Polish", value: "pl" },
                        { label: "Romanian", value: "ro" },
                        { label: "Shona", value: "sn" },
                        { label: "Swahili", value: "sw" },
                        { label: "Swedish", value: "sv" },
                        { label: "Thai", value: "th" },
                        { label: "Turkish", value: "tr" },
                        { label: "Vietnamese", value: "vi" },
                        { label: "Xhosa", value: "xh" },
                        { label: "Yoruba", value: "yo" },
                        { label: "Zulu", value: "zu" },
                      ]}
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
                        {checkedCount !== 1 ? "s" : ""} in your Shopify store
                        (title, description, and SEO meta).
                      </p>
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

                        {result.title && (
                          <Text as="p" variant="bodySm">
                            <strong>Title:</strong> {result.title}
                          </Text>
                        )}

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

                        <Text as="p" variant="bodySm">
                          <strong>Meta:</strong> {result.metaTitle} &mdash;{" "}
                          {result.metaDescription}
                        </Text>

                        {result.suggestedKeywords?.length > 0 && (
                          <InlineStack gap="200" wrap>
                            {result.suggestedKeywords.map(
                              (kw: string, ki: number) => (
                                <Tag key={ki}>{kw}</Tag>
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
    </Page>
  );
}
