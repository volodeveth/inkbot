import { useCallback } from "react";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  ProgressBar,
  Badge,
  Banner,
  Box,
  Divider,
  InlineGrid,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { checkUsageLimit } from "~/services/billing.server";
import { getGenerationsByShop, getGenerationStats } from "~/models/generation.server";
import { getOrCreateShop, markReviewClicked, dismissReviewBanner } from "~/models/shop.server";
import { PLAN_DISPLAY_NAMES } from "~/utils/plans";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  // Ensure shop exists in our DB
  const shop = await getOrCreateShop(session.shop, session.accessToken ?? "");

  const usage = await checkUsageLimit(session.shop);
  const recentGenerations = await getGenerationsByShop(session.shop, { take: 5 });
  const stats = await getGenerationStats(session.shop);
  const reviewBannerState = shop.reviewBannerState;
  const hasGenerations = stats.totalGenerations > 0;

  return json({
    shop: session.shop,
    usage,
    recentGenerations,
    stats,
    reviewBannerState,
    hasGenerations,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const actionType = formData.get("_action");

  if (actionType === "reviewClick") {
    await markReviewClicked(session.shop);
    return json({ reviewBannerState: "clicked" });
  }

  if (actionType === "dismissReview") {
    await dismissReviewBanner(session.shop);
    return json({ reviewBannerState: "dismissed" });
  }

  return json({});
}

export default function Dashboard() {
  const { usage, recentGenerations, stats, reviewBannerState, hasGenerations } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();

  const currentBannerState = actionData?.reviewBannerState || reviewBannerState;
  const showReviewBanner = hasGenerations && currentBannerState !== "dismissed";

  const handleLeaveReview = useCallback(() => {
    window.open("https://apps.shopify.com/inkbot/reviews#modal-show=WriteReviewModal", "_blank");
    const formData = new FormData();
    formData.append("_action", "reviewClick");
    submit(formData, { method: "post" });
  }, [submit]);

  const handleDismissReview = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "dismissReview");
    submit(formData, { method: "post" });
  }, [submit]);

  const usagePercent = usage.limit > 0 ? (usage.used / usage.limit) * 100 : 0;

  return (
    <Page title="">
      <BlockStack gap="500">
        {/* Logo & Tagline */}
        <Box>
          <BlockStack gap="200" inlineAlign="start">
            <img
              src="/logo.png"
              alt="InkBot"
              style={{ height: "72px", maxWidth: "320px", objectFit: "contain", display: "block" }}
            />
            <Text as="p" variant="bodyLg" tone="subdued">
              Stop writing. Start selling. AI-generated descriptions & SEO in seconds.
            </Text>
          </BlockStack>
        </Box>

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
            <p>Did you have a chance to leave a review? Either way, thanks for using InkBot!</p>
          </Banner>
        )}

        {/* Stats Row */}
        <InlineGrid columns={3} gap="400">
          {/* Usage Card */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Monthly Usage
              </Text>
              <InlineStack align="space-between">
                <Text as="span" variant="bodyMd">
                  {usage.used} / {usage.limit} descriptions
                </Text>
                <Badge tone={usage.plan === "FREE" ? "info" : "success"}>
                  {PLAN_DISPLAY_NAMES[usage.plan] || usage.plan}
                </Badge>
              </InlineStack>
              <ProgressBar
                progress={usagePercent}
                tone={usagePercent > 80 ? "critical" : "primary"}
                size="small"
              />
              {usage.plan === "FREE" && (
                <Button variant="plain" url="/app/billing">
                  Upgrade for more
                </Button>
              )}
            </BlockStack>
          </Card>

          {/* Total Generated */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Total Generated
              </Text>
              <Text as="p" variant="headingXl">
                {stats.totalGenerations}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {stats.appliedCount} applied to products
              </Text>
            </BlockStack>
          </Card>

          {/* Avg SEO Score */}
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Avg SEO Score
              </Text>
              <Text as="p" variant="headingXl">
                {stats.avgSeoScore}/100
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                across all descriptions
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* Quick Actions */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Quick Actions
            </Text>
            <InlineStack gap="300" wrap={false}>
              <Button variant="primary" url="/app/generate">
                Generate Description
              </Button>
              <Button url="/app/bulk">
                Bulk Generate
              </Button>
              <Button url="/app/settings">
                Brand Voice Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Recent Generations */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Recent Generations
              </Text>
              <Button variant="plain" url="/app/history">
                View all
              </Button>
            </InlineStack>

            {recentGenerations.length === 0 ? (
              <Box padding="400">
                <BlockStack gap="200" inlineAlign="center">
                  <Text as="p" tone="subdued" alignment="center">
                    No descriptions generated yet.
                  </Text>
                  <Button url="/app/generate">Create your first one</Button>
                </BlockStack>
              </Box>
            ) : (
              <BlockStack gap="200">
                {recentGenerations.map((gen: any) => (
                  <Box
                    key={gen.id}
                    padding="300"
                    borderWidth="025"
                    borderColor="border"
                    borderRadius="200"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="100">
                        <Text as="span" variant="bodyMd" fontWeight="semibold">
                          {gen.productTitle}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          {new Date(gen.createdAt).toLocaleDateString()}
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200">
                        <Badge>{gen.niche}</Badge>
                        {gen.seoScore && (
                          <Badge
                            tone={
                              gen.seoScore >= 80
                                ? "success"
                                : gen.seoScore >= 60
                                  ? "warning"
                                  : "critical"
                            }
                          >
                            {`SEO: ${gen.seoScore}`}
                          </Badge>
                        )}
                        {gen.status === "APPLIED" && (
                          <Badge tone="success">Applied</Badge>
                        )}
                      </InlineStack>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
