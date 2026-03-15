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
  const existing = await db.shop.findUnique({ where: { shopDomain } });
  if (existing) return existing;
  return db.shop.create({
    data: {
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

export async function markReviewClicked(shopDomain: string) {
  return db.shop.update({
    where: { shopDomain },
    data: { reviewBannerState: "clicked" },
  });
}

export async function dismissReviewBanner(shopDomain: string) {
  return db.shop.update({
    where: { shopDomain },
    data: { reviewBannerState: "dismissed" },
  });
}

export async function snoozeReviewBanner(shopDomain: string) {
  const snoozeUntil = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  return db.shop.update({
    where: { shopDomain },
    data: { reviewBannerState: `snoozed:${snoozeUntil}` },
  });
}

export function isReviewBannerVisible(state: string): boolean {
  if (state === "dismissed") return false;
  if (state.startsWith("snoozed:")) {
    const snoozedUntil = new Date(state.slice(8));
    return Date.now() >= snoozedUntil.getTime();
  }
  return true;
}

export function getEffectiveBannerState(state: string): string {
  if (state.startsWith("snoozed:")) {
    const snoozedUntil = new Date(state.slice(8));
    return Date.now() >= snoozedUntil.getTime() ? "pending" : "snoozed";
  }
  return state;
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
