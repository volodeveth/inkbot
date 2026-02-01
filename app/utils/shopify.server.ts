import type { ShopifyProduct } from "~/types/shopify";

export const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          productType
          descriptionHtml
          tags
          vendor
          status
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                price
              }
            }
          }
        }
      }
    }
  }
`;

export function parseProductsResponse(response: any): ShopifyProduct[] {
  try {
    const data = typeof response.json === "function" ? null : response;
    const products = (data?.data?.products?.edges || []).map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        productType: node.productType || "",
        descriptionHtml: node.descriptionHtml || "",
        tags: node.tags || [],
        vendor: node.vendor || "",
        status: node.status || "ACTIVE",
        featuredImage: node.featuredImage || null,
        price: node.variants?.edges?.[0]?.node?.price || null,
      };
    });
    return products;
  } catch {
    return [];
  }
}
