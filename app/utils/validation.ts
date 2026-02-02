import { z } from "zod";

export const generateDescriptionSchema = z.object({
  productTitle: z
    .string()
    .min(1, "Product title is required")
    .max(200, "Product title is too long"),
  productType: z.string().max(100).optional(),
  existingDescription: z.string().max(5000).optional(),
  features: z.string().max(2000).optional(),
  niche: z.enum([
    "fashion",
    "electronics",
    "beauty",
    "food",
    "home",
    "sports",
    "jewelry",
    "pets",
    "general",
  ]),
  tone: z.enum([
    "professional",
    "casual",
    "luxurious",
    "playful",
    "technical",
    "minimalist",
  ]),
  keywords: z.string().max(500).optional(),
  language: z
    .enum([
      "en", "fr", "de", "es", "pt", "uk",
      "af", "am", "ar", "ar-na", "bn", "zh", "cs", "da", "nl", "tl", "fi", "fr-af",
      "el", "ha", "he", "hi", "hu", "ig", "id", "it", "ja", "ko", "ms", "no",
      "om", "pl", "ro", "sn", "sw", "sv", "th", "tr", "vi", "xh", "yo", "zu",
    ])
    .optional()
    .default("en"),
});

export const brandVoiceSchema = z.object({
  tone: z.string().min(1).max(50),
  style: z.string().min(1).max(50),
  customPrompt: z.string().max(2000).optional(),
  targetAudience: z.string().max(500).optional(),
  keywords: z.string().max(1000).optional(),
  avoidWords: z.string().max(1000).optional(),
  brandValues: z.string().max(1000).optional(),
  sampleTexts: z.string().max(10000).optional(),
});

export type GenerateDescriptionFormData = z.infer<
  typeof generateDescriptionSchema
>;
export type BrandVoiceFormData = z.infer<typeof brandVoiceSchema>;

export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      raw[key] = value;
    }
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0]?.toString() || "form";
      errors[key] = issue.message;
    }
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
