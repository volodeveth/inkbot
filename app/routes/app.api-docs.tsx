import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Banner,
  Box,
  Badge,
  Button,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getShop } from "~/models/shop.server";
import { setShopApiKey, revokeShopApiKey } from "~/models/shop.server";
import { generateApiKey } from "~/services/apiKey.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  return json({
    plan: shop?.plan || "FREE",
    hasApiKey: !!shop?.apiKeyHash,
    apiKeyPrefix: shop?.apiKeyPrefix || null,
    apiKeyCreatedAt: shop?.apiKeyCreatedAt ? shop.apiKeyCreatedAt.toISOString() : null,
    appUrl: process.env.SHOPIFY_APP_URL || "",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);

  if (!shop || shop.plan !== "UNLIMITED") {
    return json({ error: "API keys require the Elite plan" }, { status: 403 });
  }

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === "generateKey" || _action === "regenerateKey") {
    const { plaintext, hash, prefix } = generateApiKey();
    await setShopApiKey(session.shop, hash, prefix);
    return json({ newKey: plaintext, prefix });
  }

  if (_action === "revokeKey") {
    await revokeShopApiKey(session.shop);
    return json({ revoked: true });
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

const codeBoxStyles = {
  background: "var(--p-color-bg-surface-secondary)",
  padding: "var(--p-space-400)",
  borderRadius: "var(--p-border-radius-200)",
  overflowX: "auto" as const,
};

function CodeBlock({ children }: { children: string }) {
  return (
    <Box>
      <div style={codeBoxStyles}>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "13px" }}>
          {children}
        </pre>
      </div>
    </Box>
  );
}

export default function ApiDocs() {
  const { plan, hasApiKey, apiKeyPrefix, apiKeyCreatedAt, appUrl } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [copied, setCopied] = useState(false);

  const handleCopyKey = useCallback(() => {
    if (actionData?.newKey) {
      navigator.clipboard.writeText(actionData.newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [actionData?.newKey]);

  const handleAction = useCallback(
    (actionName: string) => {
      const formData = new FormData();
      formData.set("_action", actionName);
      submit(formData, { method: "post" });
    },
    [submit]
  );

  if (plan !== "UNLIMITED") {
    return (
      <Page title="API Documentation">
        <Layout>
          <Layout.Section>
            <Banner
              title="API access requires the Elite plan"
              tone="warning"
              action={{ content: "Upgrade Plan", url: "/app/billing" }}
            >
              <p>
                The InkBot API is available exclusively on the Elite
                plan ($99/month). Upgrade to integrate AI-powered product
                descriptions directly into your workflow.
              </p>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const keyExists = hasApiKey || actionData?.newKey;
  const wasRevoked = actionData?.revoked;

  return (
    <Page title="API Documentation">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* API Key Management */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  API Key Management
                </Text>
                <Text as="p" variant="bodyMd">
                  Generate an API key to authenticate external requests to the InkBot API.
                  Keys use the <code>dsc_</code> prefix and are hashed before storage — the
                  plaintext key is shown only once.
                </Text>

                {actionData?.newKey && (
                  <Banner title="Save your API key now" tone="critical">
                    <BlockStack gap="200">
                      <Text as="p" variant="bodyMd">
                        This key will not be shown again. Copy it and store it securely.
                      </Text>
                      <div style={codeBoxStyles}>
                        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "13px", wordBreak: "break-all" }}>
                          {actionData.newKey}
                        </pre>
                      </div>
                      <InlineStack gap="200">
                        <Button onClick={handleCopyKey}>
                          {copied ? "Copied!" : "Copy Key"}
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Banner>
                )}

                {wasRevoked && !actionData?.newKey && (
                  <Banner title="API key revoked" tone="info">
                    <p>Your API key has been revoked. External API requests will no longer be authenticated.</p>
                  </Banner>
                )}

                {keyExists && !wasRevoked ? (
                  <BlockStack gap="200">
                    <InlineStack gap="200" align="start" blockAlign="center">
                      <Text as="p" variant="bodyMd">
                        <strong>Active key:</strong>{" "}
                        {actionData?.prefix || apiKeyPrefix}****
                      </Text>
                      {(apiKeyCreatedAt || actionData?.newKey) && (
                        <Badge>
                          {`Created ${apiKeyCreatedAt ? new Date(apiKeyCreatedAt).toLocaleDateString() : "just now"}`}
                        </Badge>
                      )}
                    </InlineStack>
                    <InlineStack gap="200">
                      <Button
                        onClick={() => handleAction("regenerateKey")}
                        loading={isSubmitting}
                      >
                        Regenerate Key
                      </Button>
                      <Button
                        onClick={() => handleAction("revokeKey")}
                        loading={isSubmitting}
                        tone="critical"
                      >
                        Revoke Key
                      </Button>
                    </InlineStack>
                  </BlockStack>
                ) : !actionData?.newKey ? (
                  <Button
                    variant="primary"
                    onClick={() => handleAction("generateKey")}
                    loading={isSubmitting}
                  >
                    Generate API Key
                  </Button>
                ) : null}
              </BlockStack>
            </Card>

            <Divider />

            {/* Authentication */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Authentication
                </Text>
                <Text as="p" variant="bodyMd">
                  All external API requests must include your API key in the
                  Authorization header using the Bearer scheme:
                </Text>
                <CodeBlock>{`Authorization: Bearer dsc_your_api_key_here`}</CodeBlock>
                <Text as="p" variant="bodyMd">
                  Requests from within the Shopify admin (embedded app) are
                  authenticated automatically via OAuth session — no API key
                  needed.
                </Text>
              </BlockStack>
            </Card>

            <Divider />

            {/* curl examples */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Example: curl
                </Text>
                <Text as="h3" variant="headingSm">
                  Single generation
                </Text>
                <CodeBlock>{`curl -X POST ${appUrl}/api/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer dsc_your_api_key_here" \\
  -d '{
    "productTitle": "Wireless Headphones",
    "niche": "electronics",
    "tone": "professional"
  }'`}</CodeBlock>
                <Text as="h3" variant="headingSm">
                  Bulk generation
                </Text>
                <CodeBlock>{`curl -X POST ${appUrl}/api/bulk-generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer dsc_your_api_key_here" \\
  -d '{
    "products": [
      { "productTitle": "Wireless Headphones", "features": ["ANC", "40h battery"] },
      { "productTitle": "Bluetooth Speaker", "features": ["Waterproof"] }
    ],
    "niche": "electronics",
    "tone": "professional"
  }'`}</CodeBlock>
              </BlockStack>
            </Card>

            <Divider />

            {/* POST /api/generate */}
            <Card>
              <BlockStack gap="400">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Badge tone="info">POST</Badge>
                  <Text as="h2" variant="headingMd">
                    /api/generate
                  </Text>
                </div>
                <Text as="p" variant="bodyMd">
                  Generate a product description for a single product. Returns an
                  SEO-optimized title, description, meta tags, SEO score, and
                  suggested keywords.
                </Text>

                <Text as="h3" variant="headingSm">
                  Request Body
                </Text>
                <CodeBlock>{`{
  "productTitle": "Wireless Noise-Cancelling Headphones",  // required
  "niche": "electronics",                                   // required
  "tone": "professional",                                   // required
  "productType": "Headphones",                              // optional
  "features": ["ANC", "40h battery", "Bluetooth 5.3"],      // optional
  "language": "en",                                         // optional, default "en"
  "keywords": ["wireless headphones", "noise cancelling"]   // optional
}`}</CodeBlock>

                <Text as="h3" variant="headingSm">
                  Successful Response (200)
                </Text>
                <CodeBlock>{`{
  "success": true,
  "result": {
    "title": "Premium Wireless Noise-Cancelling Headphones",
    "description": "<p>Experience immersive audio...</p>",
    "metaTitle": "Wireless ANC Headphones | 40h Battery",
    "metaDescription": "Shop premium wireless headphones with...",
    "seoScore": 85,
    "suggestedKeywords": ["wireless headphones", "ANC", "bluetooth"]
  },
  "usage": {
    "used": 42,
    "limit": 5000,
    "plan": "UNLIMITED"
  }
}`}</CodeBlock>

                <Text as="h3" variant="headingSm">
                  Required Fields
                </Text>
                <BlockStack gap="100">
                  <Text as="p" variant="bodyMd">
                    <strong>productTitle</strong> (string) — The name of the product
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>niche</strong> (string) — One of: fashion, electronics, beauty, food, home, sports, jewelry, pets, general
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>tone</strong> (string) — One of: professional, casual, luxurious, playful, technical, minimalist
                  </Text>
                </BlockStack>

                <Text as="h3" variant="headingSm">
                  Optional Fields
                </Text>
                <BlockStack gap="100">
                  <Text as="p" variant="bodyMd">
                    <strong>productType</strong> (string) — Product category
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>features</strong> (string[]) — Key product features
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>language</strong> (string) — Language code: en, uk, de, fr, es. Default: "en"
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>keywords</strong> (string[]) — Target SEO keywords
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>

            <Divider />

            {/* POST /api/bulk-generate */}
            <Card>
              <BlockStack gap="400">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Badge tone="info">POST</Badge>
                  <Text as="h2" variant="headingMd">
                    /api/bulk-generate
                  </Text>
                </div>
                <Text as="p" variant="bodyMd">
                  Generate descriptions for multiple products in a single request.
                  Products are processed in batches of 3 with rate limiting between
                  batches.
                </Text>

                <Text as="h3" variant="headingSm">
                  Request Body
                </Text>
                <CodeBlock>{`{
  "products": [
    {
      "productTitle": "Wireless Headphones",     // required
      "productType": "Headphones",               // optional
      "features": ["ANC", "40h battery"]         // optional
    },
    {
      "productTitle": "Bluetooth Speaker",
      "productType": "Speaker",
      "features": ["Waterproof", "360° sound"]
    }
  ],
  "niche": "electronics",    // required
  "tone": "professional",    // required
  "language": "en"           // optional, default "en"
}`}</CodeBlock>

                <Text as="h3" variant="headingSm">
                  Successful Response (200)
                </Text>
                <CodeBlock>{`{
  "success": true,
  "results": [
    {
      "productTitle": "Wireless Headphones",
      "title": "Premium Wireless Headphones with ANC",
      "description": "<p>...</p>",
      "metaTitle": "...",
      "metaDescription": "...",
      "seoScore": 82,
      "suggestedKeywords": [...]
    }
  ],
  "errors": [],
  "total": 2,
  "completed": 2,
  "skipped": 0
}`}</CodeBlock>

                <Text as="h3" variant="headingSm">
                  Fields
                </Text>
                <BlockStack gap="100">
                  <Text as="p" variant="bodyMd">
                    <strong>products</strong> (array, required) — Array of product objects, each with a required productTitle
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>niche</strong> (string, required) — Applied to all products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>tone</strong> (string, required) — Applied to all products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    <strong>language</strong> (string, optional) — Applied to all products. Default: "en"
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>

            <Divider />

            {/* Error Codes */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Error Codes
                </Text>
                <BlockStack gap="200">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="critical">400</Badge>
                    <Text as="p" variant="bodyMd">
                      Bad Request — Missing required fields or invalid JSON body
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="critical">401</Badge>
                    <Text as="p" variant="bodyMd">
                      Unauthorized — Invalid or missing API key
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="critical">403</Badge>
                    <Text as="p" variant="bodyMd">
                      Forbidden — API access requires the Elite plan
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="critical">405</Badge>
                    <Text as="p" variant="bodyMd">
                      Method Not Allowed — Only POST requests are accepted
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="warning">429</Badge>
                    <Text as="p" variant="bodyMd">
                      Too Many Requests — Monthly generation limit reached
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Badge tone="critical">500</Badge>
                    <Text as="p" variant="bodyMd">
                      Server Error — Generation failed (AI service error)
                    </Text>
                  </div>
                </BlockStack>
              </BlockStack>
            </Card>

            <Divider />

            {/* Error response format */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Error Response Format
                </Text>
                <CodeBlock>{`{
  "error": "Description of what went wrong",
  "details": "Additional context (on 500 errors)",
  "usage": {                    // included on 429 errors
    "used": 5000,
    "limit": 5000,
    "plan": "UNLIMITED"
  }
}`}</CodeBlock>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
