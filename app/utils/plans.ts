/**
 * Plan constants shared between server and client code.
 * NOT a .server.ts file so it can be safely imported in route components.
 */

export type PlanKey = "FREE" | "STARTER" | "PRO" | "UNLIMITED";

export const PLAN_LIMITS: Record<PlanKey, number> = {
  FREE: 5,
  STARTER: 100,
  PRO: 500,
  UNLIMITED: 5000,
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  STARTER: 9,
  PRO: 19,
  UNLIMITED: 49,
};

export const PLAN_FEATURES: Record<PlanKey, string[]> = {
  FREE: [
    "5 descriptions/month",
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
    "Priority support",
  ],
  UNLIMITED: [
    "5,000 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
    "Priority support",
    "API access",
  ],
};

type GatedFeature = "bulk" | "history" | "fullBrandVoice" | "api";

const PLAN_GATED_FEATURES: Record<GatedFeature, PlanKey[]> = {
  bulk: ["STARTER", "PRO", "UNLIMITED"],
  history: ["STARTER", "PRO", "UNLIMITED"],
  fullBrandVoice: ["STARTER", "PRO", "UNLIMITED"],
  api: ["UNLIMITED"],
};

export function hasPlanFeature(plan: PlanKey, feature: GatedFeature): boolean {
  return PLAN_GATED_FEATURES[feature].includes(plan);
}
