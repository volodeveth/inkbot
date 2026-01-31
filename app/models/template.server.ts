import db from "~/db.server";
import { NICHE_CONFIGS } from "~/services/prompts.server";

export async function getNicheTemplate(niche: string) {
  return db.nicheTemplate.findUnique({
    where: { niche },
  });
}

export async function getAllNicheTemplates() {
  return db.nicheTemplate.findMany({
    where: { isActive: true },
    orderBy: { displayName: "asc" },
  });
}

/**
 * Seed niche templates from the hardcoded config.
 * Run this once during initial setup.
 */
export async function seedNicheTemplates() {
  const entries = Object.values(NICHE_CONFIGS);

  for (const config of entries) {
    await db.nicheTemplate.upsert({
      where: { niche: config.name },
      update: {
        displayName: config.displayName,
        icon: config.icon,
        systemPrompt: config.systemPrompt,
        keywordPatterns: config.keywordPatterns,
        structureGuide: config.structureGuide,
      },
      create: {
        niche: config.name,
        displayName: config.displayName,
        icon: config.icon,
        systemPrompt: config.systemPrompt,
        exampleInputs: {},
        exampleOutputs: {},
        keywordPatterns: config.keywordPatterns,
        structureGuide: config.structureGuide,
      },
    });
  }
}
