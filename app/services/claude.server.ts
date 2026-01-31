import Anthropic from "@anthropic-ai/sdk";
import { getPromptForNiche } from "./prompts.server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const generationTime = Date.now() - startTime;
  const content = response.content[0];

  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  const parsed = parseGeneratedContent(content.text);

  return {
    ...parsed,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    generationTime,
  };
}

function buildSystemPrompt(input: GenerateDescriptionInput): string {
  const nichePrompt = getPromptForNiche(input.niche);

  let systemPrompt = `You are an expert e-commerce copywriter specializing in ${input.niche} products.
Your task is to create compelling, SEO-optimized product descriptions that convert visitors into buyers.

${nichePrompt}

TONE: ${input.tone}
${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ""}
LANGUAGE: ${input.language || "English"}

RULES:
1. Write unique, engaging content - never copy generic supplier descriptions
2. Focus on benefits, not just features
3. Use sensory language and emotional triggers
4. Include natural keyword placement for SEO
5. Keep paragraphs short and scannable
6. Add a compelling hook in the first sentence
7. End with a subtle call-to-action`;

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

  prompt += `

Please respond ONLY with valid JSON in the following format (no markdown, no code blocks):
{
  "title": "Optimized product title (max 70 chars)",
  "description": "Full HTML product description with <p>, <ul>, <li>, <strong> tags. Multiple paragraphs.",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 155 chars)",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "seoScore": 85
}`;

  return prompt;
}

function parseGeneratedContent(
  text: string
): Omit<GeneratedDescription, "tokensUsed" | "generationTime"> {
  try {
    // Extract JSON from response (handle possible markdown wrapping)
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
    // Fallback if JSON parsing fails
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

// Bulk generation with rate limiting
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

    // Rate limiting delay between batches
    if (i + batchSize < products.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
