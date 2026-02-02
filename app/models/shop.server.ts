import db from "~/db.server";
import { type Plan } from "@prisma/client";
import { PLAN_LIMITS } from "~/services/billing.server";

export async function getShop(shopDomain: string) {
  return db.shop.findUnique({
    where: { shopDomain },
    include: { brandVoice: true },
  });
}

export async function getOrCreateShop(
  shopDomain: string,
  accessToken: string
) {
  return db.shop.upsert({
    where: { shopDomain },
    update: { accessToken },
    create: {
      shopDomain,
      accessToken,
      plan: "FREE",
      generationsLimit: PLAN_LIMITS.FREE,
    },
  });
}

export async function updateShopSettings(
  shopDomain: string,
  data: {
    defaultNiche?: string;
    defaultTone?: string;
    defaultLanguage?: string;
  }
) {
  return db.shop.update({
    where: { shopDomain },
    data,
  });
}

export async function updateShopPlan(shopDomain: string, plan: Plan) {
  return db.shop.update({
    where: { shopDomain },
    data: {
      plan,
      generationsLimit: PLAN_LIMITS[plan],
    },
  });
}

export async function getShopByApiKeyHash(apiKeyHash: string) {
  return db.shop.findUnique({
    where: { apiKeyHash },
    include: { brandVoice: true },
  });
}

export async function setShopApiKey(
  shopDomain: string,
  apiKeyHash: string,
  apiKeyPrefix: string
) {
  return db.shop.update({
    where: { shopDomain },
    data: {
      apiKeyHash,
      apiKeyPrefix,
      apiKeyCreatedAt: new Date(),
    },
  });
}

export async function markReviewLeft(shopDomain: string) {
  return db.shop.update({
    where: { shopDomain },
    data: { reviewLeft: true },
  });
}

export async function revokeShopApiKey(shopDomain: string) {
  return db.shop.update({
    where: { shopDomain },
    data: {
      apiKeyHash: null,
      apiKeyPrefix: null,
      apiKeyCreatedAt: null,
    },
  });
}
