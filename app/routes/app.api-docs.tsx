import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Banner,
  Box,
  Badge,
  Button,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getShop } from "~/models/shop.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shop = await getShop(session.shop);
  return json({ plan: shop?.plan || "FREE" });
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
  const { plan } = useLoaderData<typeof loader>();

  if (plan !== "UNLIMITED") {
    return (
      <Page title="API Documentation">
        <Layout>
          <Layout.Section>
            <Banner
              title="API access requires the Unlimited plan"
              tone="warning"
              action={{ content: "Upgrade Plan", url: "/app/billing" }}
            >
              <p>
                The Describely API is available exclusively on the Unlimited
                plan ($99/month). Upgrade to integrate AI-powered product
                descriptions directly into your workflow.
              </p>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="API Documentation">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* Authentication */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Authentication
                </Text>
                <Text as="p" variant="bodyMd">
                  All API requests require a valid Shopify admin session. Requests
                  must be made from your authenticated Shopify admin context. The
                  API uses your shop's OAuth session token for authentication — no
                  separate API keys are needed.
                </Text>
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
    "limit": 999999,
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
                    <Badge tone="critical">403</Badge>
                    <Text as="p" variant="bodyMd">
                      Forbidden — API access requires the Unlimited plan
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
    "used": 999999,
    "limit": 999999,
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
