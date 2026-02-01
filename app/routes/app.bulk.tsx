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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { generateProductDescription } from "~/services/ai.server";
import {
  checkUsageLimit,
  incrementUsage,
} from "~/services/billing.server";
import { getAllNiches } from "~/services/prompts.server";
import { getShop } from "~/models/shop.server";
import { createGeneration } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const usage = await checkUsageLimit(session.shop);
  const niches = getAllNiches();

  return json({ usage, niches, shop: session.shop });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const usage = await checkUsageLimit(session.shop);
  const shop = await getShop(session.shop);
  const brandVoice = await getBrandVoice(session.shop);

  const productsRaw = formData.get("products") as string;
  const niche = formData.get("niche") as string;
  const tone = formData.get("tone") as string;
  const language = formData.get("language") as string;

  if (!productsRaw?.trim()) {
    return json({ error: "Please enter at least one product.", success: false });
  }

  // Parse products: each line = "Product Title | Product Type | Key Features"
  const lines = productsRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return json({ error: "No valid products found.", success: false });
  }

  const remaining = usage.limit - usage.used;
  if (lines.length > remaining) {
    return json({
      error: `You can only generate ${remaining} more descriptions this month. You entered ${lines.length} products.`,
      success: false,
    });
  }

  const results: any[] = [];
  const errors: string[] = [];

  for (const line of lines) {
    const parts = line.split("|").map((p) => p.trim());
    const productTitle = parts[0];
    const productType = parts[1] || undefined;
    const features = parts[2]
      ? parts[2].split(",").map((f) => f.trim())
      : undefined;

    if (!productTitle) {
      errors.push(`Skipped empty line`);
      continue;
    }

    try {
      const result = await generateProductDescription({
        productTitle,
        productType,
        features,
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

      if (shop) {
        await createGeneration({
          shopId: shop.id,
          productTitle,
          productType,
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
      }

      await incrementUsage(session.shop);

      results.push({
        productTitle,
        ...result,
      });
    } catch (error) {
      errors.push(`Failed: ${productTitle}`);
    }

    // Small delay between requests
    if (lines.indexOf(line) < lines.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return json({
    success: true,
    results,
    errors,
    total: lines.length,
    completed: results.length,
  });
}

export default function BulkPage() {
  const { usage, niches } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isProcessing = navigation.state === "submitting";

  const [products, setProducts] = useState("");
  const [niche, setNiche] = useState("general");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");

  const productCount = products
    .split("\n")
    .filter((l) => l.trim()).length;

  const remaining = usage.limit - usage.used;

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("products", products);
    formData.append("niche", niche);
    formData.append("tone", tone);
    formData.append("language", language);
    submit(formData, { method: "post" });
  }, [products, niche, tone, language, submit]);

  const handleCopyAll = useCallback(() => {
    if (!actionData?.results) return;
    const text = actionData.results
      .map(
        (r: any) =>
          `## ${r.productTitle}\n\nTitle: ${r.title}\n\n${r.description}\n\nMeta Title: ${r.metaTitle}\nMeta Description: ${r.metaDescription}\nSEO Score: ${r.seoScore}/100`
      )
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
  }, [actionData]);

  const nicheOptions = niches.map((n: any) => ({
    label: `${n.icon} ${n.displayName}`,
    value: n.name,
  }));

  return (
    <Page
      title="Bulk Generate"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
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
            {actionData && !actionData.success && actionData.error && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            {/* Input */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Products
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Enter one product per line. Format:{" "}
                  <strong>Product Title | Product Type | Features (comma-separated)</strong>
                </Text>

                <TextField
                  label="Product List"
                  value={products}
                  onChange={setProducts}
                  multiline={10}
                  autoComplete="off"
                  placeholder={
                    "Premium Wireless Headphones | Headphones | Noise cancellation, 40h battery, Bluetooth 5.3\nOrganic Cotton T-Shirt | T-Shirt | 100% organic, breathable, unisex\nVitamin C Serum | Skincare | 20% vitamin C, hyaluronic acid, anti-aging"
                  }
                />

                <InlineStack align="space-between">
                  <Text as="span" variant="bodySm" tone="subdued">
                    {productCount} product{productCount !== 1 ? "s" : ""} entered
                    &middot; {remaining} generations remaining
                  </Text>
                  {productCount > remaining && remaining > 0 && (
                    <Badge tone="warning">
                      {`Only ${remaining} will be processed`}
                    </Badge>
                  )}
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Settings */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Settings (applied to all)
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
                        { label: "English", value: "en" },
                        { label: "Ukrainian", value: "uk" },
                        { label: "German", value: "de" },
                        { label: "French", value: "fr" },
                        { label: "Spanish", value: "es" },
                      ]}
                      value={language}
                      onChange={setLanguage}
                    />
                  </Box>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Submit */}
            <InlineStack align="end">
              <Button
                variant="primary"
                size="large"
                onClick={handleSubmit}
                disabled={productCount === 0 || isProcessing || remaining <= 0}
                loading={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Generate ${Math.min(productCount, remaining)} Description${Math.min(productCount, remaining) !== 1 ? "s" : ""}`}
              </Button>
            </InlineStack>

            {/* Progress */}
            {isProcessing && (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Processing...
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Generating descriptions for {productCount} products. This may
                    take a moment.
                  </Text>
                  <ProgressBar progress={50} tone="primary" />
                </BlockStack>
              </Card>
            )}

            {/* Results */}
            {actionData?.success && actionData?.results && (
              <BlockStack gap="400">
                <Card>
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                      <Text as="h2" variant="headingMd">
                        Results
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {actionData.completed} / {actionData.total} completed
                        {actionData.errors?.length > 0 &&
                          ` (${actionData.errors.length} failed)`}
                      </Text>
                    </BlockStack>
                    <Button onClick={handleCopyAll}>Copy All</Button>
                  </InlineStack>
                </Card>

                {actionData.errors?.length > 0 && (
                  <Banner tone="warning">
                    <p>
                      Some products failed:{" "}
                      {actionData.errors.join(", ")}
                    </p>
                  </Banner>
                )}

                {actionData.results.map((result: any, i: number) => (
                  <Card key={i}>
                    <BlockStack gap="300">
                      <InlineStack
                        align="space-between"
                        blockAlign="center"
                      >
                        <Text as="h3" variant="headingSm">
                          {result.productTitle}
                        </Text>
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
                    </BlockStack>
                  </Card>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
