/**
 * Plan constants shared between server and client code.
 * NOT a .server.ts file so it can be safely imported in route components.
 */

export type PlanKey = "FREE" | "STARTER" | "PRO" | "UNLIMITED";

export const PLAN_LIMITS: Record<PlanKey, number> = {
  FREE: 10,
  STARTER: 100,
  PRO: 500,
  UNLIMITED: 999999,
};

export const PLAN_PRICES: Record<PlanKey, number> = {
  FREE: 0,
  STARTER: 19,
  PRO: 49,
  UNLIMITED: 99,
};

export const PLAN_FEATURES: Record<PlanKey, string[]> = {
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
