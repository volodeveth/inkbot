import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  TextField,
  Select,
  Button,
  Banner,
  Text,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import { getShop } from "~/models/shop.server";
import { upsertBrandVoice } from "~/models/brandVoice.server";
import { hasPlanFeature, type PlanKey } from "~/utils/plans";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const shop = await getShop(session.shop);

  const plan = (shop?.plan || "FREE") as PlanKey;

  return json({
    brandVoice: shop?.brandVoice || null,
    shopSettings: shop
      ? {
          defaultNiche: shop.defaultNiche,
          defaultTone: shop.defaultTone,
          defaultLanguage: shop.defaultLanguage,
        }
      : null,
    plan,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const shop = await getShop(session.shop);
  if (!shop) {
    return json({ error: "Shop not found", success: false });
  }

  try {
    await upsertBrandVoice(shop.id, {
      tone: (formData.get("tone") as string) || undefined,
      style: (formData.get("style") as string) || undefined,
      customPrompt: (formData.get("customPrompt") as string) || undefined,
      targetAudience: (formData.get("targetAudience") as string) || undefined,
      keywords: (formData.get("keywords") as string)
        ?.split(",")
        .map((k) => k.trim())
        .filter(Boolean) || [],
      avoidWords: (formData.get("avoidWords") as string)
        ?.split(",")
        .map((k) => k.trim())
        .filter(Boolean) || [],
      brandValues: (formData.get("brandValues") as string)
        ?.split(",")
        .map((k) => k.trim())
        .filter(Boolean) || [],
      sampleTexts: (formData.get("sampleTexts") as string)
        ?.split("\n---\n")
        .filter(Boolean) || [],
    });

    return json({ success: true });
  } catch (error) {
    console.error("Settings save error:", error);
    return json({ error: "Failed to save settings", success: false });
  }
}

export default function SettingsPage() {
  const { brandVoice, plan } = useLoaderData<typeof loader>();
  const canUseFullBrandVoice = hasPlanFeature(plan as PlanKey, "fullBrandVoice");
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSaving = navigation.state === "submitting";

  const [formState, setFormState] = useState({
    tone: brandVoice?.tone || "professional",
    style: brandVoice?.style || "balanced",
    customPrompt: brandVoice?.customPrompt || "",
    targetAudience: brandVoice?.targetAudience || "",
    keywords: brandVoice?.keywords?.join(", ") || "",
    avoidWords: brandVoice?.avoidWords?.join(", ") || "",
    brandValues: brandVoice?.brandValues?.join(", ") || "",
    sampleTexts: brandVoice?.sampleTexts?.join("\n---\n") || "",
  });

  const updateField = (field: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Brand Voice Settings"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Success/Error Banners */}
            {actionData?.success && (
              <Banner tone="success" title="Settings Saved">
                <p>Your brand voice settings have been updated.</p>
              </Banner>
            )}
            {actionData && !actionData.success && actionData.error && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            <Banner tone="info">
              <p>
                Configure your brand voice so every generated description matches
                your unique style and tone automatically.
              </p>
            </Banner>

            {/* Voice & Style */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Voice & Style
                </Text>

                <Select
                  label="Default Tone"
                  options={[
                    { label: "Professional", value: "professional" },
                    { label: "Casual & Friendly", value: "casual" },
                    { label: "Luxurious & Premium", value: "luxurious" },
                    { label: "Playful & Fun", value: "playful" },
                    { label: "Technical & Detailed", value: "technical" },
                  ]}
                  value={formState.tone}
                  onChange={updateField("tone")}
                />

                <Select
                  label="Writing Style"
                  options={[
                    { label: "Balanced", value: "balanced" },
                    { label: "Minimalist", value: "minimalist" },
                    { label: "Detailed & Comprehensive", value: "detailed" },
                    { label: "Storytelling", value: "storytelling" },
                    { label: "Benefit-Focused", value: "benefits" },
                  ]}
                  value={formState.style}
                  onChange={updateField("style")}
                />

                <TextField
                  label="Target Audience"
                  value={formState.targetAudience}
                  onChange={updateField("targetAudience")}
                  placeholder="e.g., Young professionals aged 25-35 who value quality and sustainability"
                  autoComplete="off"
                  helpText="Describe your ideal customer"
                />
              </BlockStack>
            </Card>

            {/* Keywords & Vocabulary */}
            {canUseFullBrandVoice ? (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Keywords & Vocabulary
                  </Text>

                  <TextField
                    label="Brand Keywords (always include)"
                    value={formState.keywords}
                    onChange={updateField("keywords")}
                    placeholder="premium, handcrafted, sustainable, innovative"
                    helpText="Comma-separated words to naturally include in descriptions"
                    autoComplete="off"
                  />

                  <TextField
                    label="Words to Avoid"
                    value={formState.avoidWords}
                    onChange={updateField("avoidWords")}
                    placeholder="cheap, basic, generic"
                    helpText="Comma-separated words that don't fit your brand"
                    autoComplete="off"
                  />

                  <TextField
                    label="Brand Values"
                    value={formState.brandValues}
                    onChange={updateField("brandValues")}
                    placeholder="sustainability, quality, innovation, customer-first"
                    helpText="Core values to subtly weave into descriptions"
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            ) : (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Keywords & Vocabulary
                  </Text>
                  <Banner tone="warning">
                    <p>
                      Keywords, avoid words, and brand values are available on Starter plan and above.{" "}
                      <Button variant="plain" url="/app/billing">
                        Upgrade your plan
                      </Button>
                    </p>
                  </Banner>
                </BlockStack>
              </Card>
            )}

            {/* Custom Instructions */}
            {canUseFullBrandVoice ? (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Custom AI Instructions
                  </Text>

                  <TextField
                    label="Additional Instructions"
                    value={formState.customPrompt}
                    onChange={updateField("customPrompt")}
                    multiline={4}
                    placeholder="e.g., Always mention our 30-day return policy. Use British English spelling. Never use exclamation marks."
                    helpText="These instructions are included in every generation"
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            ) : (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Custom AI Instructions
                  </Text>
                  <Banner tone="warning">
                    <p>
                      Custom AI instructions are available on Starter plan and above.{" "}
                      <Button variant="plain" url="/app/billing">
                        Upgrade your plan
                      </Button>
                    </p>
                  </Banner>
                </BlockStack>
              </Card>
            )}

            {/* Sample Descriptions */}
            {canUseFullBrandVoice ? (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Sample Descriptions
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Paste 2-3 of your best product descriptions below. AI will learn
                    from these examples to match your writing style. Separate each
                    example with a line containing only <strong>---</strong>
                  </Text>

                  <TextField
                    label="Example Descriptions"
                    value={formState.sampleTexts}
                    onChange={updateField("sampleTexts")}
                    multiline={10}
                    placeholder={
                      "Your first product description here...\n---\nYour second product description here...\n---\nYour third product description here..."
                    }
                    autoComplete="off"
                  />
                </BlockStack>
              </Card>
            ) : (
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Sample Descriptions
                  </Text>
                  <Banner tone="warning">
                    <p>
                      Sample descriptions are available on Starter plan and above.{" "}
                      <Button variant="plain" url="/app/billing">
                        Upgrade your plan
                      </Button>
                    </p>
                  </Banner>
                </BlockStack>
              </Card>
            )}

            {/* Save */}
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
              >
                Save Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
