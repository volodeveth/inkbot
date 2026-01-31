import { json, type ActionFunctionArgs } from "@remix-run/node";
import Anthropic from "@anthropic-ai/sdk";
import { authenticate } from "../shopify.server";
import { getShop } from "~/models/shop.server";
import { upsertBrandVoice } from "~/models/brandVoice.server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * POST /api/analyze-voice
 *
 * Analyzes sample descriptions and extracts brand voice characteristics.
 *
 * Body JSON:
 * {
 *   sampleTexts: string[]   — 1-5 sample product descriptions
 * }
 *
 * Returns analyzed voice profile: tone, style, keywords, etc.
 */
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sampleTexts } = body;

  if (!Array.isArray(sampleTexts) || sampleTexts.length === 0) {
    return json(
      { error: "sampleTexts array with at least 1 item is required" },
      { status: 400 }
    );
  }

  try {
    const samplesFormatted = sampleTexts
      .slice(0, 5)
      .map((text: string, i: number) => `Description ${i + 1}:\n"${text.substring(0, 500)}"`)
      .join("\n\n");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a brand voice analyst. Analyze product descriptions and extract the brand's writing characteristics. Respond ONLY with valid JSON, no markdown.`,
      messages: [
        {
          role: "user",
          content: `Analyze these product descriptions and extract the brand voice characteristics:

${samplesFormatted}

Respond with JSON:
{
  "tone": "one word: professional/casual/luxurious/playful/technical/minimalist",
  "style": "one word: balanced/minimalist/detailed/storytelling/benefits",
  "keywords": ["array of 5-10 recurring brand-specific words or phrases"],
  "avoidWords": ["array of words this brand seems to avoid"],
  "targetAudience": "brief description of likely target audience",
  "brandValues": ["array of 3-5 inferred brand values"],
  "summary": "2-3 sentence summary of the brand voice"
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Optionally save to DB
    const shop = await getShop(session.shop);
    if (shop) {
      await upsertBrandVoice(shop.id, {
        tone: analysis.tone,
        style: analysis.style,
        keywords: analysis.keywords || [],
        avoidWords: analysis.avoidWords || [],
        targetAudience: analysis.targetAudience,
        brandValues: analysis.brandValues || [],
        sampleTexts: sampleTexts.slice(0, 5),
      });
    }

    return json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("Voice analysis error:", error);
    return json(
      { error: "Analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
