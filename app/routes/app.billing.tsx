import {
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Box,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {
  checkUsageLimit,
  syncPlanFromShopify,
  getManagedPricingUrl,
} from "~/services/billing.server";
import { PLAN_PRICES, PLAN_LIMITS, PLAN_FEATURES, PLAN_SLUGS, type PlanKey } from "~/utils/plans";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  // Sync plan from Shopify's Managed Pricing
  const { plan, subscriptionStatus } = await syncPlanFromShopify(session.shop, admin);
  const usage = await checkUsageLimit(session.shop);
  const pricingBaseUrl = getManagedPricingUrl(session.shop);

  return json({
    usage,
    currentPlan: plan,
    subscriptionStatus,
    pricingBaseUrl,
  });
}

const PLANS: { key: PlanKey; name: string; popular?: boolean }[] = [
  { key: "FREE", name: "Free" },
  { key: "STARTER", name: "Starter" },
  { key: "PRO", name: "Pro", popular: true },
  { key: "UNLIMITED", name: "Elite" },
];

export default function BillingPage() {
  const { usage, currentPlan, subscriptionStatus, pricingBaseUrl } =
    useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  const handleChangePlan = (planKey: PlanKey) => {
    const url = `${pricingBaseUrl}/${PLAN_SLUGS[planKey]}`;
    window.open(url, "_top");
  };

  return (
    <Page
      title="Billing & Plans"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Current Usage */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Current Usage
                </Text>
                <InlineStack gap="400" wrap>
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">Plan</Text>
                    <Badge tone={currentPlan === "FREE" ? "info" : "success"}>
                      {PLANS.find(p => p.key === currentPlan)?.name || currentPlan}
                    </Badge>
                  </Box>
                  <Box>
                    <Text as="p" variant="bodySm" tone="subdued">Used this month</Text>
                    <Text as="p" variant="headingSm">
                      {usage.used} / {usage.limit}
                    </Text>
                  </Box>
                  {subscriptionStatus && (
                    <Box>
                      <Text as="p" variant="bodySm" tone="subdued">Status</Text>
                      <Badge
                        tone={subscriptionStatus === "ACTIVE" ? "success" : "warning"}
                      >
                        {subscriptionStatus}
                      </Badge>
                    </Box>
                  )}
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Plans Grid */}
            <InlineGrid columns={4} gap="400">
              {PLANS.map(({ key, name, popular }) => {
                const isCurrent = currentPlan === key;
                const price = PLAN_PRICES[key];
                const limit = PLAN_LIMITS[key];
                const features = PLAN_FEATURES[key];

                return (
                  <Card key={key}>
                    <BlockStack gap="400">
                      {/* Header */}
                      <BlockStack gap="200">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text as="h3" variant="headingMd">
                            {name}
                          </Text>
                          {popular && (
                            <Badge tone="attention">Popular</Badge>
                          )}
                          {isCurrent && (
                            <Badge tone="success">Current</Badge>
                          )}
                        </InlineStack>

                        <InlineStack gap="100" blockAlign="baseline">
                          <Text as="span" variant="headingXl">
                            ${price}
                          </Text>
                          <Text as="span" variant="bodySm" tone="subdued">
                            /month
                          </Text>
                        </InlineStack>

                        <Text as="p" variant="bodySm" tone="subdued">
                          {`${limit.toLocaleString()} descriptions/month`}
                        </Text>
                      </BlockStack>

                      <Divider />

                      {/* Features */}
                      <BlockStack gap="200">
                        {features.map((feature, i) => (
                          <InlineStack key={i} gap="200" blockAlign="center">
                            <Text as="span" variant="bodySm">
                              ✓
                            </Text>
                            <Text as="span" variant="bodySm">
                              {feature}
                            </Text>
                          </InlineStack>
                        ))}
                      </BlockStack>

                      {/* Action */}
                      <Box paddingBlockStart="200">
                        {isCurrent ? (
                          <Button disabled>Current Plan</Button>
                        ) : (
                          <Button
                            variant={popular ? "primary" : undefined}
                            onClick={() => handleChangePlan(key)}
                            loading={isLoading}
                          >
                            {PLAN_PRICES[key] > PLAN_PRICES[currentPlan]
                              ? "Upgrade"
                              : key === "FREE"
                                ? "Downgrade"
                                : "Switch"}
                          </Button>
                        )}
                      </Box>
                    </BlockStack>
                  </Card>
                );
              })}
            </InlineGrid>

            {/* FAQ */}
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Frequently Asked Questions
                </Text>

                <BlockStack gap="200">
                  <Text as="p" fontWeight="semibold">
                    When does my usage reset?
                  </Text>
                  <Text as="p" variant="bodySm">
                    Your monthly usage counter resets automatically on the first
                    day of each calendar month.
                  </Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="p" fontWeight="semibold">
                    Can I switch plans anytime?
                  </Text>
                  <Text as="p" variant="bodySm">
                    Yes, you can upgrade or downgrade at any time. Changes take
                    effect immediately. When upgrading, you'll be charged the
                    prorated difference.
                  </Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text as="p" fontWeight="semibold">
                    What happens if I exceed my limit?
                  </Text>
                  <Text as="p" variant="bodySm">
                    You won't be able to generate new descriptions until the next
                    month or until you upgrade your plan.
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
