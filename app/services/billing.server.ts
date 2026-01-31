import db from "~/db.server";
import { type Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 10,
  STARTER: 100,
  PRO: 500,
  UNLIMITED: 999999,
};

export const PLAN_PRICES: Record<Plan, number> = {
  FREE: 0,
  STARTER: 19,
  PRO: 49,
  UNLIMITED: 99,
};

export const PLAN_FEATURES: Record<Plan, string[]> = {
  FREE: [
    "10 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Basic brand voice",
  ],
  STARTER: [
    "100 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
  ],
  PRO: [
    "500 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
    "Competitor analysis",
    "Priority support",
  ],
  UNLIMITED: [
    "Unlimited descriptions",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
    "Competitor analysis",
    "Priority support",
    "API access",
  ],
};

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

export async function createSubscription(
  shopDomain: string,
  plan: Plan,
  admin: any
): Promise<string> {
  if (plan === "FREE") {
    await db.shop.update({
      where: { shopDomain },
      data: {
        plan: "FREE",
        generationsLimit: PLAN_LIMITS.FREE,
        subscriptionId: null,
        subscriptionStatus: null,
      },
    });
    return "";
  }

  const response = await admin.graphql(
    `
    mutation createSubscription($name: String!, $price: Decimal!, $returnUrl: URL!) {
      appSubscriptionCreate(
        name: $name,
        returnUrl: $returnUrl,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: $price, currencyCode: USD }
                interval: EVERY_30_DAYS
              }
            }
          }
        ]
      ) {
        appSubscription {
          id
        }
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        name: `Describely ${plan} Plan`,
        price: PLAN_PRICES[plan],
        returnUrl: `${process.env.SHOPIFY_APP_URL}/app/billing/confirm`,
      },
    }
  );

  const data = await response.json();

  if (data.data?.appSubscriptionCreate?.userErrors?.length) {
    throw new Error(
      data.data.appSubscriptionCreate.userErrors[0].message
    );
  }

  const subscriptionId = data.data.appSubscriptionCreate.appSubscription.id;

  // Save subscription ID
  await db.shop.update({
    where: { shopDomain },
    data: {
      plan,
      generationsLimit: PLAN_LIMITS[plan],
      subscriptionId,
      subscriptionStatus: "PENDING",
    },
  });

  return data.data.appSubscriptionCreate.confirmationUrl;
}

export async function confirmSubscription(
  shopDomain: string,
  chargeId: string
): Promise<void> {
  await db.shop.update({
    where: { shopDomain },
    data: {
      subscriptionStatus: "ACTIVE",
    },
  });
}

export async function cancelSubscription(
  shopDomain: string
): Promise<void> {
  await db.shop.update({
    where: { shopDomain },
    data: {
      plan: "FREE",
      generationsLimit: PLAN_LIMITS.FREE,
      subscriptionId: null,
      subscriptionStatus: null,
    },
  });
}
