import { useState, useCallback, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import {
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Button,
  Badge,
  Box,
  Thumbnail,
  Spinner,
  Pagination,
} from "@shopify/polaris";
import { SearchIcon, ImageIcon } from "@shopify/polaris-icons";
import type { ShopifyProduct, PageInfo } from "~/types/shopify";

interface ProductPickerProps {
  products: ShopifyProduct[];
  selectedProduct: ShopifyProduct | null;
  onSelect: (product: ShopifyProduct) => void;
  onClear: () => void;
  initialPageInfo?: PageInfo;
}

export function ProductPicker({
  products,
  selectedProduct,
  onSelect,
  onClear,
  initialPageInfo,
}: ProductPickerProps) {
  const fetcher = useFetcher<{ products: ShopifyProduct[]; pageInfo?: PageInfo }>();
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = fetcher.state === "submitting" || fetcher.state === "loading";
  const displayProducts = fetcher.data?.products ?? products;

  // Track current page info
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo>(
    initialPageInfo ?? { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null }
  );

  // Update pageInfo when fetcher returns data
  useEffect(() => {
    if (fetcher.data?.pageInfo) {
      setCurrentPageInfo(fetcher.data.pageInfo);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) return;

    debounceRef.current = setTimeout(() => {
      const formData = new FormData();
      formData.append("_action", "searchProducts");
      formData.append("query", query);
      fetcher.submit(formData, { method: "post" });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (!currentPageInfo.endCursor) return;
    const formData = new FormData();
    formData.append("_action", "searchProducts");
    formData.append("query", query);
    formData.append("after", currentPageInfo.endCursor);
    formData.append("direction", "forward");
    fetcher.submit(formData, { method: "post" });
  }, [currentPageInfo.endCursor, query, fetcher]);

  const handlePreviousPage = useCallback(() => {
    if (!currentPageInfo.startCursor) return;
    const formData = new FormData();
    formData.append("_action", "searchProducts");
    formData.append("query", query);
    formData.append("before", currentPageInfo.startCursor);
    formData.append("direction", "backward");
    fetcher.submit(formData, { method: "post" });
  }, [currentPageInfo.startCursor, query, fetcher]);

  const showPagination = currentPageInfo.hasNextPage || currentPageInfo.hasPreviousPage;

  const statusTone = useCallback((status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "success" as const;
      case "DRAFT":
        return "info" as const;
      case "ARCHIVED":
        return "warning" as const;
      default:
        return undefined;
    }
  }, []);

  if (selectedProduct) {
    return (
      <Box
        padding="300"
        background="bg-surface-secondary"
        borderRadius="200"
      >
        <InlineStack gap="300" align="space-between" blockAlign="center">
          <InlineStack gap="300" blockAlign="center">
            {selectedProduct.featuredImage ? (
              <Thumbnail
                source={selectedProduct.featuredImage.url}
                alt={selectedProduct.featuredImage.altText || selectedProduct.title}
                size="small"
              />
            ) : (
              <Thumbnail
                source={ImageIcon}
                alt={selectedProduct.title}
                size="small"
              />
            )}
            <BlockStack gap="100">
              <Text as="span" fontWeight="semibold">
                {selectedProduct.title}
              </Text>
              <InlineStack gap="200">
                {selectedProduct.productType && (
                  <Text as="span" variant="bodySm" tone="subdued">
                    {selectedProduct.productType}
                  </Text>
                )}
                {selectedProduct.price && (
                  <Text as="span" variant="bodySm" tone="subdued">
                    ${selectedProduct.price}
                  </Text>
                )}
              </InlineStack>
            </BlockStack>
          </InlineStack>
          <Button variant="plain" onClick={onClear}>
            Clear
          </Button>
        </InlineStack>
      </Box>
    );
  }

  return (
    <BlockStack gap="300">
      <TextField
        label="Search products"
        labelHidden
        value={query}
        onChange={handleSearch}
        placeholder="Search your Shopify products..."
        prefix={<span style={{ display: "flex" }}><SearchIcon /></span>}
        autoComplete="off"
        suffix={isSearching ? <Spinner size="small" /> : undefined}
      />

      <div
        style={{
          border: "1px solid var(--p-color-border)",
          borderRadius: "var(--p-border-radius-200)",
          overflowY: "auto",
          maxHeight: "300px",
        }}
      >
        {displayProducts.length === 0 ? (
          <Box padding="400">
            <Text as="p" tone="subdued" alignment="center">
              No products found
            </Text>
          </Box>
        ) : (
          <BlockStack>
            {displayProducts.map((product) => (
              <Box key={product.id}>
                <button
                  type="button"
                  onClick={() => onSelect(product)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--p-color-bg-surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <InlineStack gap="300" blockAlign="center">
                    {product.featuredImage ? (
                      <Thumbnail
                        source={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        size="small"
                      />
                    ) : (
                      <Thumbnail
                        source={ImageIcon}
                        alt={product.title}
                        size="small"
                      />
                    )}
                    <BlockStack gap="100">
                      <Text as="span" fontWeight="semibold">
                        {product.title}
                      </Text>
                      <InlineStack gap="200">
                        {product.productType && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            {product.productType}
                          </Text>
                        )}
                        <Badge tone={statusTone(product.status)}>
                          {product.status.toLowerCase()}
                        </Badge>
                        {product.price && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            ${product.price}
                          </Text>
                        )}
                      </InlineStack>
                    </BlockStack>
                  </InlineStack>
                </button>
              </Box>
            ))}
          </BlockStack>
        )}
      </div>

      {/* Pagination */}
      {showPagination && (
        <InlineStack align="center">
          <Pagination
            hasPrevious={currentPageInfo.hasPreviousPage}
            onPrevious={handlePreviousPage}
            hasNext={currentPageInfo.hasNextPage}
            onNext={handleNextPage}
          />
        </InlineStack>
      )}

      <Text as="p" variant="bodySm" tone="subdued">
        Or enter product details manually below
      </Text>
    </BlockStack>
  );
}
