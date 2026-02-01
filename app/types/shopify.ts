export interface ShopifyProduct {
  id: string;
  title: string;
  productType: string;
  descriptionHtml: string;
  tags: string[];
  vendor: string;
  status: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  price: string | null;
}
