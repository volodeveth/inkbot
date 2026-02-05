import OpenAI from "openai";
import { getPromptForNiche } from "./prompts.server";
import { type GenerateOptions, DEFAULT_GENERATE_OPTIONS } from "~/utils/generateOptions";

// Re-export for convenience
export { type GenerateOptions, DEFAULT_GENERATE_OPTIONS };

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export interface GenerateDescriptionInput {
  productTitle: string;
  productType?: string;
  existingDescription?: string;
  features?: string[];
  niche: string;
  tone: string;
  targetAudience?: string;
  keywords?: string[];
  brandVoice?: {
    tone?: string;
    style?: string;
    customPrompt?: string;
    sampleTexts?: string[];
    keywords?: string[];
    avoidWords?: string[];
  };
  competitorDescriptions?: string[];
  language?: string;
  generateOptions?: GenerateOptions;
}

export interface GeneratedDescription {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  suggestedKeywords: string[];
  seoScore: number;
  tokensUsed: number;
  generationTime: number;
}

export async function generateProductDescription(
  input: GenerateDescriptionInput
): Promise<GeneratedDescription> {
  const systemPrompt = buildSystemPrompt(input);
  const userPrompt = buildUserPrompt(input);

  const startTime = Date.now();

  const response = await openai.chat.completions.create({
    model: "deepseek/deepseek-chat-v3-0324",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 1.1,
    max_tokens: 2000,
  });

  const generationTime = Date.now() - startTime;
  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("Empty response from DeepSeek API");
  }

  const parsed = parseGeneratedContent(content);

  return {
    ...parsed,
    tokensUsed:
      (response.usage?.prompt_tokens ?? 0) +
      (response.usage?.completion_tokens ?? 0),
    generationTime,
  };
}

const LANGUAGE_NAMES: Record<string, string> = {
  // Priority
  en: "English",
  fr: "French",
  de: "German",
  es: "Spanish",
  pt: "Portuguese",
  uk: "Ukrainian",
  // Alphabetical
  af: "Afrikaans",
  am: "Amharic",
  ar: "Arabic",
  "ar-na": "Arabic (North African)",
  bn: "Bengali",
  zh: "Chinese",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  tl: "Filipino",
  fi: "Finnish",
  "fr-af": "French (African)",
  el: "Greek",
  ha: "Hausa",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  ig: "Igbo",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  ms: "Malay",
  no: "Norwegian",
  om: "Oromo",
  pl: "Polish",
  ro: "Romanian",
  sn: "Shona",
  sw: "Swahili",
  sv: "Swedish",
  th: "Thai",
  tr: "Turkish",
  vi: "Vietnamese",
  xh: "Xhosa",
  yo: "Yoruba",
  zu: "Zulu",
};

function getLanguageName(code?: string): string {
  if (!code) return "English";
  return LANGUAGE_NAMES[code] || "English";
}

function buildSystemPrompt(input: GenerateDescriptionInput): string {
  const nichePrompt = getPromptForNiche(input.niche);
  const languageName = getLanguageName(input.language);

  let systemPrompt = `You are an expert e-commerce copywriter specializing in ${input.niche} products.
Your task is to create compelling, SEO-optimized product descriptions that convert visitors into buyers.

${nichePrompt}

TONE: ${input.tone}
${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ""}

CRITICAL LANGUAGE REQUIREMENT: You MUST write ALL output content (title, description, metaTitle, metaDescription, suggestedKeywords) in ${languageName}. Every single word of the generated content must be in ${languageName}. Do NOT write in English${languageName !== "English" ? " — use ONLY " + languageName : ""}.

RULES:
1. Write unique, engaging content - never copy generic supplier descriptions
2. Focus on benefits, not just features
3. Use sensory language and emotional triggers
4. Include natural keyword placement for SEO
5. Keep paragraphs short and scannable
6. Add a compelling hook in the first sentence
7. End with a subtle call-to-action
8. ALL content MUST be written in ${languageName}`;

  if (input.brandVoice?.customPrompt) {
    systemPrompt += `\n\nBRAND VOICE INSTRUCTIONS:\n${input.brandVoice.customPrompt}`;
  }

  if (input.brandVoice?.keywords?.length) {
    systemPrompt += `\n\nBRAND KEYWORDS (naturally include these): ${input.brandVoice.keywords.join(", ")}`;
  }

  if (input.brandVoice?.avoidWords?.length) {
    systemPrompt += `\n\nWORDS TO AVOID: ${input.brandVoice.avoidWords.join(", ")}`;
  }

  if (input.brandVoice?.sampleTexts?.length) {
    systemPrompt += `\n\nBRAND VOICE EXAMPLES (match this style):\n`;
    input.brandVoice.sampleTexts.forEach((text, i) => {
      systemPrompt += `Example ${i + 1}: "${text.substring(0, 300)}"\n`;
    });
  }

  return systemPrompt;
}

function buildUserPrompt(input: GenerateDescriptionInput): string {
  const options = input.generateOptions ?? DEFAULT_GENERATE_OPTIONS;

  let prompt = `Create a product description for:

PRODUCT: ${input.productTitle}
${input.productType ? `TYPE: ${input.productType}` : ""}
${input.features?.length ? `FEATURES:\n${input.features.map((f) => `- ${f}`).join("\n")}` : ""}
${input.existingDescription ? `CURRENT DESCRIPTION (improve this):\n${input.existingDescription}` : ""}
${input.keywords?.length ? `TARGET KEYWORDS: ${input.keywords.join(", ")}` : ""}`;

  if (input.competitorDescriptions?.length) {
    prompt += `\n\nCOMPETITOR DESCRIPTIONS (differentiate from these):\n`;
    input.competitorDescriptions.forEach((desc, i) => {
      prompt += `Competitor ${i + 1}: "${desc.substring(0, 200)}"\n`;
    });
  }

  const languageName = getLanguageName(input.language);

  // Build what to generate list
  const generateList: string[] = [];
  if (options.title) generateList.push("title");
  if (options.description) generateList.push("description");
  if (options.metaTitle) generateList.push("metaTitle");
  if (options.metaDescription) generateList.push("metaDescription");
  if (options.keywords) generateList.push("suggestedKeywords");

  prompt += `

IMPORTANT: Write ALL content in ${languageName}.
GENERATE ONLY: ${generateList.join(", ")}. Leave other fields as empty strings or empty arrays.

Please respond ONLY with valid JSON in the following format (no markdown, no code blocks):
{
  "title": ${options.title ? `"Optimized product title in ${languageName} (max 70 chars)"` : '""'},
  "description": ${options.description ? `"Full HTML product description in ${languageName} with <p>, <ul>, <li>, <strong> tags. Multiple paragraphs."` : '""'},
  "metaTitle": ${options.metaTitle ? `"SEO meta title in ${languageName} (max 60 chars)"` : '""'},
  "metaDescription": ${options.metaDescription ? `"SEO meta description in ${languageName} (max 155 chars)"` : '""'},
  "suggestedKeywords": ${options.keywords ? `["keyword1 in ${languageName}", "keyword2 in ${languageName}", "keyword3", "keyword4", "keyword5"]` : '[]'},
  "seoScore": 85
}`;

  return prompt;
}

function parseGeneratedContent(
  text: string
): Omit<GeneratedDescription, "tokensUsed" | "generationTime"> {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      title: parsed.title || "",
      description: parsed.description || "",
      metaTitle: parsed.metaTitle || "",
      metaDescription: parsed.metaDescription || "",
      suggestedKeywords: parsed.suggestedKeywords || [],
      seoScore: Math.min(100, Math.max(0, parsed.seoScore || 70)),
    };
  } catch {
    return {
      title: "",
      description: text,
      metaTitle: "",
      metaDescription: "",
      suggestedKeywords: [],
      seoScore: 70,
    };
  }
}

export async function generateBulkDescriptions(
  products: GenerateDescriptionInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<GeneratedDescription[]> {
  const results: GeneratedDescription[] = [];
  const batchSize = 3;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((product) => generateProductDescription(product))
    );

    results.push(...batchResults);

    if (onProgress) {
      onProgress(results.length, products.length);
    }

    if (i + batchSize < products.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
