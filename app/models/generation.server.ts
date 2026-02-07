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
  const stats = await db.generation.aggregate({
    where: {
      shop: { shopDomain },
    },
    _count: true,
    _avg: { seoScore: true },
  });

  const appliedCount = await db.generation.count({
    where: {
      shop: { shopDomain },
      status: "APPLIED",
    },
  });

  return {
    totalGenerations: stats._count,
    avgSeoScore: Math.round(stats._avg.seoScore || 0),
    appliedCount,
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
