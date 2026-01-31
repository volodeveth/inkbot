import { json, type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { generateProductDescription } from "~/services/claude.server";
import { checkUsageLimit, incrementUsage } from "~/services/billing.server";
import { getShop } from "~/models/shop.server";
import { createGeneration } from "~/models/generation.server";
import { getBrandVoice } from "~/models/brandVoice.server";

/**
 * POST /api/bulk-generate
 *
 * Bulk generation API endpoint.
 *
 * Body JSON:
 * {
 *   products: Array<{
 *     productTitle: string
 *     productType?: string
 *     features?: string[]
 *   }>
 *   niche: string
 *   tone: string
 *   language?: string
 * }
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

  const { products, niche, tone, language } = body;

  if (!Array.isArray(products) || products.length === 0) {
    return json({ error: "products array is required" }, { status: 400 });
  }

  if (!niche || !tone) {
    return json({ error: "niche and tone are required" }, { status: 400 });
  }

  // Check usage
  const usage = await checkUsageLimit(session.shop);
  const remaining = usage.limit - usage.used;

  if (remaining <= 0) {
    return json(
      {
        error: "Monthly limit reached. Upgrade your plan.",
        usage: { used: usage.used, limit: usage.limit, plan: usage.plan },
      },
      { status: 429 }
    );
  }

  // Limit to remaining quota
  const productsToProcess = products.slice(0, remaining);
  const shop = await getShop(session.shop);
  const brandVoice = await getBrandVoice(session.shop);

  const results: any[] = [];
  const errors: { productTitle: string; error: string }[] = [];

  // Process in batches of 3
  const batchSize = 3;
  for (let i = 0; i < productsToProcess.length; i += batchSize) {
    const batch = productsToProcess.slice(i, i + batchSize);

    const batchPromises = batch.map(async (product: any) => {
      try {
        const result = await generateProductDescription({
          productTitle: product.productTitle,
          productType: product.productType,
          features: product.features,
          niche,
          tone,
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

        if (shop) {
          await createGeneration({
            shopId: shop.id,
            productTitle: product.productTitle,
            productType: product.productType,
            niche,
            tone,
            keywords: [],
            title: result.title,
            description: result.description,
            metaTitle: result.metaTitle,
            metaDescription: result.metaDescription,
            seoScore: result.seoScore,
            tokensUsed: result.tokensUsed,
            generationTime: result.generationTime,
          });
        }

        await incrementUsage(session.shop);

        results.push({
          productTitle: product.productTitle,
          ...result,
        });
      } catch (error: any) {
        errors.push({
          productTitle: product.productTitle,
          error: error.message || "Generation failed",
        });
      }
    });

    await Promise.all(batchPromises);

    // Rate limiting between batches
    if (i + batchSize < productsToProcess.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return json({
    success: true,
    results,
    errors,
    total: productsToProcess.length,
    completed: results.length,
    skipped: products.length - productsToProcess.length,
  });
}
