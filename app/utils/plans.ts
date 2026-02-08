/**
 * Plan constants shared between server and client code.
 * NOT a .server.ts file so it can be safely imported in route components.
 */

export type PlanKey = "FREE" | "STARTER" | "PRO" | "UNLIMITED";

export const PLAN_DISPLAY_NAMES: Record<PlanKey, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  UNLIMITED: "Elite",
};

export const PLAN_LIMITS: Record<PlanKey, number> = {
  FREE: 100,
  STARTER: 1000,
  PRO: 10000,
  UNLIMITED: 100000,
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  STARTER: 9,
  PRO: 19,
  UNLIMITED: 99,
};

export const PLAN_SLUGS: Record<PlanKey, string> = {
  FREE: "free",
  STARTER: "starter",
  PRO: "pro",
  UNLIMITED: "unlimited",
};

export const PLAN_FEATURES: Record<PlanKey, string[]> = {
  FREE: [
    "100 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Basic brand voice",
  ],
  STARTER: [
    "1,000 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
  ],
  PRO: [
    "10,000 descriptions/month",
    "All 9 niches",
    "SEO optimization",
    "Full brand voice",
    "Bulk generation",
    "Generation history",
    "Priority support",
  ],
  UNLIMITED: [
    "100,000 descriptions/month",
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
