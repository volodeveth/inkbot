import db from "~/db.server";

export interface BrandVoiceInput {
  tone?: string;
  style?: string;
  keywords?: string[];
  avoidWords?: string[];
  sampleTexts?: string[];
  customPrompt?: string;
  targetAudience?: string;
  brandValues?: string[];
}

export async function getBrandVoice(shopDomain: string) {
  return db.brandVoice.findFirst({
    where: {
      shop: { shopDomain },
    },
  });
}

export async function upsertBrandVoice(
  shopId: string,
  data: BrandVoiceInput
) {
  return db.brandVoice.upsert({
    where: { shopId },
    update: {
      tone: data.tone,
      style: data.style,
      keywords: data.keywords || [],
      avoidWords: data.avoidWords || [],
      sampleTexts: data.sampleTexts || [],
      customPrompt: data.customPrompt,
      targetAudience: data.targetAudience,
      brandValues: data.brandValues || [],
    },
    create: {
      shopId,
      tone: data.tone,
      style: data.style,
      keywords: data.keywords || [],
      avoidWords: data.avoidWords || [],
      sampleTexts: data.sampleTexts || [],
      customPrompt: data.customPrompt,
      targetAudience: data.targetAudience,
      brandValues: data.brandValues || [],
    },
  });
}
