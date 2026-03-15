import db from "~/db.server";
import { type GenerationStatus } from "@prisma/client";

export interface CreateGenerationInput {
  shopId: string;
  productId?: string;
  productTitle: string;
  productType?: string;
  niche: string;
  tone: string;
  keywords?: string[];
  competitorUrls?: string[];
  title?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoScore?: number;
  tokensUsed?: number;
  generationTime?: number;
  status?: GenerationStatus;
}

export async function createGeneration(data: CreateGenerationInput) {
  return db.generation.create({
    data: {
      shopId: data.shopId,
      productId: data.productId,
      productTitle: data.productTitle,
      productType: data.productType,
      niche: data.niche,
      tone: data.tone,
      keywords: data.keywords || [],
      competitorUrls: data.competitorUrls || [],
      title: data.title,
      description: data.description,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      seoScore: data.seoScore,
      tokensUsed: data.tokensUsed || 0,
      generationTime: data.generationTime || 0,
      status: data.status || "COMPLETED",
    },
  });
}

export async function getGenerationsByShop(
  shopDomain: string,
  options?: {
    take?: number;
    skip?: number;
    niche?: string;
    status?: GenerationStatus;
    search?: string;
  }
) {
  return db.generation.findMany({
    where: {
      shop: { shopDomain },
      ...(options?.niche ? { niche: options.niche } : {}),
      ...(options?.status ? { status: options.status } : {}),
      ...(options?.search ? { productTitle: { contains: options.search, mode: "insensitive" as const } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: options?.take || 20,
    skip: options?.skip || 0,
  });
}

export async function getGenerationById(id: string) {
  return db.generation.findUnique({
    where: { id },
  });
}

export async function markGenerationApplied(id: string) {
  return db.generation.update({
    where: { id },
    data: {
      status: "APPLIED",
      appliedAt: new Date(),
    },
  });
}

export async function getGenerationStats(shopDomain: string) {
  const [row] = await db.$queryRaw<
    [{ total: bigint; avgseo: number | null; applied: bigint }]
  >`
    SELECT
      COUNT(*)::bigint AS total,
      AVG("seoScore") AS avgseo,
      COUNT(*) FILTER (WHERE status = 'APPLIED')::bigint AS applied
    FROM "Generation" g
    JOIN "Shop" s ON g."shopId" = s.id
    WHERE s."shopDomain" = ${shopDomain}
  `;

  return {
    totalGenerations: Number(row.total),
    avgSeoScore: Math.round(row.avgseo || 0),
    appliedCount: Number(row.applied),
  };
}

export async function getGeneratedProductIds(shopDomain: string): Promise<Set<string>> {
  const generations = await db.generation.findMany({
    where: {
      shop: { shopDomain },
      productId: { not: null },
    },
    select: {
      productId: true,
    },
    distinct: ["productId"],
  });

  return new Set(
    generations
      .map((g) => g.productId)
      .filter((id): id is string => id !== null)
  );
}
