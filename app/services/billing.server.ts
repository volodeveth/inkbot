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

  const isTest = process.env.SHOPIFY_BILLING_TEST === "true";

  const response = await admin.graphql(
    `
    mutation createSubscription($name: String!, $price: Decimal!, $returnUrl: URL!, $test: Boolean) {
      appSubscriptionCreate(
        name: $name,
        returnUrl: $returnUrl,
        test: $test,
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
        test: isTest ? true : null,
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
