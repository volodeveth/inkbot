import {
  InlineStack,
  Text,
  ProgressBar,
  Badge,
  Button,
  BlockStack,
} from "@shopify/polaris";
import type { Plan } from "@prisma/client";
import { PLAN_DISPLAY_NAMES } from "~/utils/plans";

interface UsageCounterProps {
  used: number;
  limit: number;
  plan: Plan;
  showUpgrade?: boolean;
  compact?: boolean;
}

export function UsageCounter({
  used,
  limit,
  plan,
  showUpgrade = true,
  compact = false,
}: UsageCounterProps) {
  const percent = limit > 0 ? (used / limit) * 100 : 0;
  const tone = percent > 90 ? "critical" : "primary";

  if (compact) {
    return (
      <InlineStack gap="200" blockAlign="center">
        <Text as="span" variant="bodySm" tone="subdued">
          {used}/{limit}
        </Text>
        <Badge tone={plan === "FREE" ? "info" : "success"}>
          {PLAN_DISPLAY_NAMES[plan] || plan}
        </Badge>
      </InlineStack>
    );
  }

  return (
    <BlockStack gap="200">
      <InlineStack align="space-between">
        <Text as="span" variant="bodyMd">
          {used} / {limit} descriptions
        </Text>
        <Badge tone={plan === "FREE" ? "info" : "success"}>{PLAN_DISPLAY_NAMES[plan] || plan}</Badge>
      </InlineStack>
      <ProgressBar progress={percent} tone={tone} size="small" />
      {showUpgrade && plan === "FREE" && percent > 50 && (
        <Button variant="plain" url="/app/billing">
          Upgrade for more
        </Button>
      )}
    </BlockStack>
  );
}
