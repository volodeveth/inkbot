import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticateApiRequest } from "~/services/apiAuth.server";
import { generateProductDescription } from "~/services/ai.server";
import { checkUsageLimit, incrementUsage } from "~/services/billing.server";
import { getShop } from "~/models/shop.server";
import { createGeneration } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
}

/**
 * POST /api/generate
 *
 * Standalone API endpoint for description generation.
 * Supports both Shopify session auth and Bearer API key auth.
 *
 * Body JSON:
 * {
 *   productTitle: string (required)
 *   productType?: string
 *   existingDescription?: string
 *   features?: string[]
 *   niche: string (required)
 *   tone: string (required)
 *   keywords?: string[]
 *   language?: string
 * }
 */
export async function action({ request }: ActionFunctionArgs) {
  const { shopDomain } = await authenticateApiRequest(request);

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  // Check usage
  const usage = await checkUsageLimit(shopDomain);
  if (usage.plan !== "UNLIMITED") {
    return json(
      { error: "API access requires Unlimited plan." },
      { status: 403, headers: corsHeaders }
    );
  }
  if (!usage.allowed) {
    return json(
      {
        error: "Monthly limit reached. Upgrade your plan.",
        usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
      },
      { status: 429, headers: corsHeaders }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400, headers: corsHeaders });
  }

  const { productTitle, productType, existingDescription, features, niche, tone, keywords, language } = body;

  if (!productTitle || !niche || !tone) {
    return json(
      { error: "productTitle, niche, and tone are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const shop = await getShop(shopDomain);
    const brandVoice = await getBrandVoice(shopDomain);

    const result = await generateProductDescription({
      productTitle,
      productType,
      existingDescription,
      features,
      niche,
      tone,
      keywords,
      language: language || "en",
      brandVoice: brandVoice
        ? {
            tone: brandVoice.tone || undefined,
            style: brandVoice.style || undefined,
            customPrompt: brandVoice.customPrompt || undefined,
            sampleTexts: brandVoice.sampleTexts || undefined,
            keywords: brandVoice.keywords || undefined,
            avoidWords: brandVoice.avoidWords || undefined,
          }
        : undefined,
    });

    // Save to DB
    if (shop) {
      await createGeneration({
        shopId: shop.id,
        productTitle,
        productType,
        niche,
        tone,
        keywords,
        title: result.title,
        description: result.description,
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        seoScore: result.seoScore,
        tokensUsed: result.tokensUsed,
        generationTime: result.generationTime,
      });
    }

    await incrementUsage(shopDomain);

    return json(
      {
        success: true,
        result,
        usage: {
          used: usage.used + 1,
          limit: usage.limit,
          plan: usage.plan,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("API generate error:", error);
    return json(
      { error: "Generation failed", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
