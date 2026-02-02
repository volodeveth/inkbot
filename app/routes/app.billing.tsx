import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
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
  Banner,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {
  checkUsageLimit,
  createSubscription,
  cancelSubscription,
} from "~/services/billing.server";
import { PLAN_PRICES, PLAN_LIMITS, PLAN_FEATURES, type PlanKey } from "~/utils/plans";
import { getShop } from "~/models/shop.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const shop = await getShop(session.shop);
  const usage = await checkUsageLimit(session.shop);

  return json({
    usage,
    currentPlan: shop?.plan || "FREE",
    subscriptionStatus: shop?.subscriptionStatus || null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan") as PlanKey;
  const actionType = formData.get("_action") as string;

  if (actionType === "subscribe") {
    try {
      const confirmationUrl = await createSubscription(
        session.shop,
        plan,
        admin
      );

      if (confirmationUrl) {
        return redirect(confirmationUrl);
      }

      return json({ success: true });
    } catch (error: any) {
      return json({ error: error.message || "Failed to create subscription", success: false });
    }
  }

  if (actionType === "cancel") {
    try {
      await cancelSubscription(session.shop);
      return json({ success: true, cancelled: true });
    } catch (error: any) {
      return json({ error: error.message || "Failed to cancel subscription", success: false });
    }
  }

  return json({ success: false });
}

const PLANS: { key: PlanKey; name: string; popular?: boolean }[] = [
  { key: "FREE", name: "Free" },
  { key: "STARTER", name: "Starter" },
  { key: "PRO", name: "Pro", popular: true },
  { key: "UNLIMITED", name: "Unlimited" },
];

export default function BillingPage() {
  const { usage, currentPlan, subscriptionStatus } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const handleSubscribe = (plan: PlanKey) => {
    const formData = new FormData();
    formData.append("_action", "subscribe");
    formData.append("plan", plan);
    submit(formData, { method: "post" });
  };

  const handleCancel = () => {
    const formData = new FormData();
    formData.append("_action", "cancel");
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Billing & Plans"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Action feedback */}
            {actionData?.error && (
              <Banner tone="critical" title="Subscription Error">
                <p>{actionData.error}</p>
              </Banner>
            )}
            {actionData?.cancelled && (
              <Banner tone="success" title="Plan Cancelled">
                <p>Your subscription has been cancelled. You are now on the Free plan.</p>
              </Banner>
            )}

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
                      {currentPlan}
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
                          {limit >= 999999
                            ? "Unlimited descriptions"
                            : `${limit} descriptions/month`}
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
                          currentPlan !== "FREE" ? (
                            <Button
                              onClick={handleCancel}
                              tone="critical"
                              disabled={isSubmitting}
                            >
                              Cancel Plan
                            </Button>
                          ) : (
                            <Button disabled>Current Plan</Button>
                          )
                        ) : (
                          <Button
                            variant={popular ? "primary" : undefined}
                            onClick={() => handleSubscribe(key)}
                            loading={isSubmitting}
                            disabled={isSubmitting}
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
