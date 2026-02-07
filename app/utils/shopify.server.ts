import type { ShopifyProduct, ShopifyCollection, PageInfo } from "~/types/shopify";

export const PRODUCTS_QUERY = `
  query getProducts($first: Int, $last: Int, $after: String, $before: String, $query: String) {
    products(first: $first, last: $last, after: $after, before: $before, query: $query, sortKey: UPDATED_AT, reverse: true) {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
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

export const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          productsCount {
            count
          }
        }
      }
    }
  }
`;

export function parseCollectionsResponse(response: any): ShopifyCollection[] {
  try {
    const data = typeof response.json === "function" ? null : response;
    const collections = (data?.data?.collections?.edges || []).map((edge: any) => {
      const node = edge.node;
      return {
        id: node.id,
        title: node.title,
        productsCount: node.productsCount?.count || 0,
      };
    });
    return collections;
  } catch {
    return [];
  }
}

export const PRODUCTS_BY_COLLECTION_QUERY = `
  query getProductsByCollection($collectionId: ID!, $first: Int, $last: Int, $after: String, $before: String) {
    collection(id: $collectionId) {
      products(first: $first, last: $last, after: $after, before: $before) {
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
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

export function parseProductsByCollectionResponse(response: any): ShopifyProduct[] {
  try {
    const data = typeof response.json === "function" ? null : response;
    const products = (data?.data?.collection?.products?.edges || []).map((edge: any) => {
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

const DEFAULT_PAGE_INFO: PageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  endCursor: null,
  startCursor: null,
};

function parsePageInfo(raw: any): PageInfo {
  if (!raw) return DEFAULT_PAGE_INFO;
  return {
    hasNextPage: !!raw.hasNextPage,
    hasPreviousPage: !!raw.hasPreviousPage,
    endCursor: raw.endCursor ?? null,
    startCursor: raw.startCursor ?? null,
  };
}

function parseProductNode(node: any): ShopifyProduct {
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
}

export function parseProductsPageResponse(response: any): { products: ShopifyProduct[]; pageInfo: PageInfo } {
  try {
    const data = typeof response.json === "function" ? null : response;
    const productsData = data?.data?.products;
    const products = (productsData?.edges || []).map((edge: any) => parseProductNode(edge.node));
    const pageInfo = parsePageInfo(productsData?.pageInfo);
    return { products, pageInfo };
  } catch {
    return { products: [], pageInfo: DEFAULT_PAGE_INFO };
  }
}

export function parseProductsByCollectionPageResponse(response: any): { products: ShopifyProduct[]; pageInfo: PageInfo } {
  try {
    const data = typeof response.json === "function" ? null : response;
    const productsData = data?.data?.collection?.products;
    const products = (productsData?.edges || []).map((edge: any) => parseProductNode(edge.node));
    const pageInfo = parsePageInfo(productsData?.pageInfo);
    return { products, pageInfo };
  } catch {
    return { products: [], pageInfo: DEFAULT_PAGE_INFO };
  }
}
