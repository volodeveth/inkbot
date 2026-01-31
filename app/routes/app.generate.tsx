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
  Spinner,
  Box,
  Divider,
  Tag,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { generateProductDescription } from "~/services/claude.server";
import {
  checkUsageLimit,
  incrementUsage,
} from "~/services/billing.server";
import { getAllNiches } from "~/services/prompts.server";
import { getShop } from "~/models/shop.server";
import { createGeneration } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";
import {
  generateDescriptionSchema,
  parseFormData,
} from "~/utils/validation";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const usage = await checkUsageLimit(session.shop);
  const niches = getAllNiches();
  const brandVoice = await getBrandVoice(session.shop);

  return json({ usage, niches, brandVoice, shop: session.shop });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "generate") {
    // Validate form
    const validation = parseFormData(generateDescriptionSchema, formData);
    if (!validation.success) {
      return json({ error: Object.values(validation.errors).join(", "), success: false });
    }

    // Check usage limit
    const usage = await checkUsageLimit(session.shop);
    if (!usage.allowed) {
      return json({
        error: "Monthly limit reached. Upgrade your plan for more descriptions.",
        success: false,
      });
    }

    try {
      const shop = await getShop(session.shop);
      const brandVoice = await getBrandVoice(session.shop);

      const featuresRaw = formData.get("features") as string;
      const keywordsRaw = formData.get("keywords") as string;

      const input = {
        productTitle: formData.get("productTitle") as string,
        productType: (formData.get("productType") as string) || undefined,
        existingDescription:
          (formData.get("existingDescription") as string) || undefined,
        features: featuresRaw
          ? featuresRaw.split("\n").filter(Boolean)
          : undefined,
        niche: formData.get("niche") as string,
        tone: formData.get("tone") as string,
        keywords: keywordsRaw
          ? keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean)
          : undefined,
        language: (formData.get("language") as string) || "en",
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
      };

      const result = await generateProductDescription(input);

      // Save to database
      if (shop) {
        await createGeneration({
          shopId: shop.id,
          productId: (formData.get("productId") as string) || undefined,
          productTitle: input.productTitle,
          productType: input.productType,
          niche: input.niche,
          tone: input.tone,
          keywords: input.keywords,
          title: result.title,
          description: result.description,
          metaTitle: result.metaTitle,
          metaDescription: result.metaDescription,
          seoScore: result.seoScore,
          tokensUsed: result.tokensUsed,
          generationTime: result.generationTime,
        });
      }

      // Increment usage
      await incrementUsage(session.shop);

      return json({
        success: true,
        result,
        newUsage: usage.used + 1,
      });
    } catch (error) {
      console.error("Generation error:", error);
      return json({
        error: "Failed to generate description. Please try again.",
        success: false,
      });
    }
  }

  if (actionType === "apply") {
    const productId = formData.get("productId") as string;
    const description = formData.get("description") as string;
    const title = formData.get("title") as string;

    if (!productId) {
      return json({ error: "No product selected to apply to.", success: false });
    }

    try {
      await admin.graphql(
        `
        mutation updateProduct($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              descriptionHtml
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
              id: productId,
              title,
              descriptionHtml: description,
            },
          },
        }
      );

      return json({ success: true, applied: true });
    } catch (error) {
      return json({ error: "Failed to update product.", success: false });
    }
  }

  return json({ success: false });
}

export default function GeneratePage() {
  const { usage, niches, brandVoice } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isGenerating =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "generate";

  const [formState, setFormState] = useState({
    productTitle: "",
    productType: "",
    existingDescription: "",
    features: "",
    niche: "general",
    tone: "professional",
    keywords: "",
    language: "en",
  });

  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const updateField = useCallback(
    (field: string) => (value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const nicheOptions = niches.map((n: any) => ({
    label: `${n.icon} ${n.displayName}`,
    value: n.name,
  }));

  const toneOptions = [
    { label: "Professional", value: "professional" },
    { label: "Casual & Friendly", value: "casual" },
    { label: "Luxurious", value: "luxurious" },
    { label: "Playful", value: "playful" },
    { label: "Technical", value: "technical" },
    { label: "Minimalist", value: "minimalist" },
  ];

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Ukrainian", value: "uk" },
    { label: "German", value: "de" },
    { label: "French", value: "fr" },
    { label: "Spanish", value: "es" },
  ];

  const handleGenerate = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "generate");
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (selectedProduct) {
      formData.append("productId", selectedProduct.id);
    }
    submit(formData, { method: "post" });
  }, [formState, selectedProduct, submit]);

  const handleApply = useCallback(() => {
    if (!selectedProduct || !actionData?.result) return;
    const formData = new FormData();
    formData.append("_action", "apply");
    formData.append("productId", selectedProduct.id);
    formData.append("title", actionData.result.title);
    formData.append("description", actionData.result.description);
    submit(formData, { method: "post" });
  }, [selectedProduct, actionData, submit]);

  const handleCopy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
    },
    []
  );

  return (
    <Page
      title="Generate Description"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        {/* Left: Input Form */}
        <Layout.Section>
          <BlockStack gap="500">
            {/* Usage Warning */}
            {!usage.allowed && (
              <Banner tone="warning" title="Usage Limit Reached">
                <p>
                  You've used all {usage.limit} descriptions this month.{" "}
                  <Button variant="plain" url="/app/billing">
                    Upgrade now
                  </Button>
                </p>
              </Banner>
            )}

            {/* Error */}
            {actionData && !actionData.success && actionData.error && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            {/* Success: Applied */}
            {actionData?.applied && (
              <Banner tone="success" title="Description Applied">
                <p>Product has been updated in your Shopify store.</p>
              </Banner>
            )}

            {/* Product Details */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  1. Product Details
                </Text>

                <TextField
                  label="Product Title"
                  value={formState.productTitle}
                  onChange={updateField("productTitle")}
                  autoComplete="off"
                  placeholder="e.g., Premium Wireless Headphones"
                />

                <TextField
                  label="Product Type"
                  value={formState.productType}
                  onChange={updateField("productType")}
                  autoComplete="off"
                  placeholder="e.g., Headphones, T-Shirt, Skincare"
                />

                <TextField
                  label="Key Features"
                  value={formState.features}
                  onChange={updateField("features")}
                  multiline={4}
                  autoComplete="off"
                  placeholder={
                    "Enter each feature on a new line:\nNoise cancellation\n40-hour battery life\nPremium leather"
                  }
                  helpText="One feature per line"
                />

                <TextField
                  label="Current Description (optional)"
                  value={formState.existingDescription}
                  onChange={updateField("existingDescription")}
                  multiline={3}
                  autoComplete="off"
                  helpText="Paste existing description to improve it"
                />
              </BlockStack>
            </Card>

            {/* Generation Settings */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  2. Generation Settings
                </Text>

                <InlineStack gap="400" wrap>
                  <Box minWidth="180px">
                    <Select
                      label="Niche"
                      options={nicheOptions}
                      value={formState.niche}
                      onChange={updateField("niche")}
                    />
                  </Box>

                  <Box minWidth="180px">
                    <Select
                      label="Tone"
                      options={toneOptions}
                      value={formState.tone}
                      onChange={updateField("tone")}
                    />
                  </Box>

                  <Box minWidth="180px">
                    <Select
                      label="Language"
                      options={languageOptions}
                      value={formState.language}
                      onChange={updateField("language")}
                    />
                  </Box>
                </InlineStack>

                <TextField
                  label="Target Keywords (optional)"
                  value={formState.keywords}
                  onChange={updateField("keywords")}
                  autoComplete="off"
                  placeholder="wireless headphones, noise canceling, premium audio"
                  helpText="Comma-separated keywords for SEO optimization"
                />

                {brandVoice && (
                  <Banner tone="info">
                    <p>
                      Brand voice is configured. Tone: <strong>{brandVoice.tone}</strong>,
                      Style: <strong>{brandVoice.style}</strong>.{" "}
                      <Button variant="plain" url="/app/settings">
                        Edit
                      </Button>
                    </p>
                  </Banner>
                )}
              </BlockStack>
            </Card>

            {/* Generate Button */}
            <InlineStack align="space-between" blockAlign="center">
              <Text as="span" variant="bodySm" tone="subdued">
                {usage.used} / {usage.limit} used this month
              </Text>
              <Button
                variant="primary"
                size="large"
                onClick={handleGenerate}
                disabled={
                  !formState.productTitle || isGenerating || !usage.allowed
                }
                loading={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Description"}
              </Button>
            </InlineStack>
          </BlockStack>
        </Layout.Section>

        {/* Right: Results */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Result
              </Text>

              {isGenerating ? (
                <Box padding="800">
                  <BlockStack gap="400" inlineAlign="center">
                    <Spinner size="large" />
                    <Text as="p" tone="subdued" alignment="center">
                      AI is crafting your description...
                    </Text>
                  </BlockStack>
                </Box>
              ) : actionData?.result ? (
                <BlockStack gap="400">
                  {/* SEO Score */}
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" fontWeight="semibold">
                      SEO Score
                    </Text>
                    <Badge
                      tone={
                        actionData.result.seoScore >= 80
                          ? "success"
                          : actionData.result.seoScore >= 60
                            ? "warning"
                            : "critical"
                      }
                    >
                      {`${actionData.result.seoScore}/100`}
                    </Badge>
                  </InlineStack>

                  <Divider />

                  {/* Title */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Optimized Title
                    </Text>
                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <Text as="p">{actionData.result.title}</Text>
                    </Box>
                  </BlockStack>

                  {/* Description */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Product Description
                    </Text>
                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: actionData.result.description,
                        }}
                      />
                    </Box>
                  </BlockStack>

                  {/* Meta Title */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Meta Title
                    </Text>
                    <Box
                      padding="200"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <Text as="p" variant="bodySm">
                        {actionData.result.metaTitle}
                      </Text>
                    </Box>
                  </BlockStack>

                  {/* Meta Description */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Meta Description
                    </Text>
                    <Box
                      padding="200"
                      background="bg-surface-secondary"
                      borderRadius="200"
                    >
                      <Text as="p" variant="bodySm">
                        {actionData.result.metaDescription}
                      </Text>
                    </Box>
                  </BlockStack>

                  {/* Keywords */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Suggested Keywords
                    </Text>
                    <InlineStack gap="200" wrap>
                      {actionData.result.suggestedKeywords.map(
                        (kw: string, i: number) => (
                          <Tag key={i}>{kw}</Tag>
                        )
                      )}
                    </InlineStack>
                  </BlockStack>

                  <Divider />

                  {/* Actions */}
                  <BlockStack gap="200">
                    {selectedProduct && (
                      <Button variant="primary" onClick={handleApply}>
                        Apply to Shopify Product
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        handleCopy(actionData.result.description)
                      }
                    >
                      Copy Description
                    </Button>
                    <Button
                      onClick={() =>
                        handleCopy(
                          `${actionData.result.title}\n\n${actionData.result.description}\n\nMeta: ${actionData.result.metaTitle}\n${actionData.result.metaDescription}`
                        )
                      }
                      variant="plain"
                    >
                      Copy All
                    </Button>
                  </BlockStack>
                </BlockStack>
              ) : (
                <Box padding="400">
                  <Text as="p" tone="subdued" alignment="center">
                    Fill in product details and click "Generate" to create an
                    AI-powered description.
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
