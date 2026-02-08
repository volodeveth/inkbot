import db from "~/db.server";
import { type Plan } from "@prisma/client";
import { PLAN_LIMITS, PLAN_PRICES } from "~/utils/plans";

export { PLAN_LIMITS, PLAN_PRICES, PLAN_FEATURES } from "~/utils/plans";

export interface UsageInfo {
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
}

export async function checkUsageLimit(shopDomain: string): Promise<UsageInfo> {
  const shop = await db.shop.findUnique({
    where: { shopDomain },
  });

  if (!shop) {
    return { allowed: true, used: 0, limit: PLAN_LIMITS.FREE, plan: "FREE" };
  }

  // Check if we need to reset monthly counter
  const now = new Date();
  const resetDate = new Date(shop.resetDate);

  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    // Reset counter for new month
    await db.shop.update({
      where: { shopDomain },
      data: {
        generationsUsed: 0,
        resetDate: now,
      },
    });
    return {
      allowed: true,
      used: 0,
      limit: PLAN_LIMITS[shop.plan],
      plan: shop.plan,
    };
  }

  const limit = PLAN_LIMITS[shop.plan];
  const allowed = shop.generationsUsed < limit;

  return {
    allowed,
    used: shop.generationsUsed,
    limit,
    plan: shop.plan,
  };
}

export async function incrementUsage(
  shopDomain: string,
  count: number = 1
): Promise<void> {
  await db.shop.update({
    where: { shopDomain },
    data: {
      generationsUsed: { increment: count },
    },
  });
}

export async function getOrCreateShop(
  shopDomain: string,
  accessToken: string
): Promise<{ id: string; plan: Plan }> {
  const shop = await db.shop.upsert({
    where: { shopDomain },
    update: { accessToken },
    create: {
      shopDomain,
      accessToken,
      plan: "FREE",
      generationsLimit: PLAN_LIMITS.FREE,
    },
    select: { id: true, plan: true },
  });

  return shop;
}

/**
 * Sync the current plan from Shopify's Managed Pricing.
 * Queries activeSubscriptions and maps to our Plan enum by price.
 */
export async function syncPlanFromShopify(
  shopDomain: string,
  admin: any
): Promise<{ plan: Plan; subscriptionId: string | null; subscriptionStatus: string | null }> {
  const response = await admin.graphql(
    `query {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }`
  );

  const data = await response.json();
  const subscriptions =
    data.data?.currentAppInstallation?.activeSubscriptions || [];

  let plan: Plan = "FREE";
  let subscriptionId: string | null = null;
  let subscriptionStatus: string | null = null;

  if (subscriptions.length > 0) {
    const active = subscriptions[0];
    subscriptionId = active.id;
    subscriptionStatus = active.status;

    const price = parseFloat(
      active.lineItems?.[0]?.plan?.pricingDetails?.price?.amount || "0"
    );

    if (price >= 99) plan = "UNLIMITED";
    else if (price >= 19) plan = "PRO";
    else if (price >= 9) plan = "STARTER";
  }

  // Sync to database
  const updateData: any = {
    plan,
    generationsLimit: PLAN_LIMITS[plan],
    subscriptionId,
    subscriptionStatus,
  };

  // If downgraded from UNLIMITED, revoke API keys
  if (plan !== "UNLIMITED") {
    updateData.apiKeyHash = null;
    updateData.apiKeyPrefix = null;
    updateData.apiKeyCreatedAt = null;
  }

  await db.shop.update({
    where: { shopDomain },
    data: updateData,
  });

  return { plan, subscriptionId, subscriptionStatus };
}

/**
 * Get the Shopify admin URL where merchants can manage their app subscription.
 */
export function getManagedPricingUrl(shopDomain: string): string {
  const storeHandle = shopDomain.replace(".myshopify.com", "");
  return `https://admin.shopify.com/store/${storeHandle}/charges`;
}
