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
  Checkbox,
} from "@shopify/polaris";
import { SearchIcon, ImageIcon } from "@shopify/polaris-icons";
import type { ShopifyProduct } from "~/types/shopify";

interface BulkProductPickerProps {
  products: ShopifyProduct[];
  selectedProducts: ShopifyProduct[];
  onToggle: (product: ShopifyProduct) => void;
  onClearAll: () => void;
}

export function BulkProductPicker({
  products,
  selectedProducts,
  onToggle,
  onClearAll,
}: BulkProductPickerProps) {
  const fetcher = useFetcher<{ products: ShopifyProduct[] }>();
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = fetcher.state === "submitting" || fetcher.state === "loading";
  const displayProducts = fetcher.data?.products ?? products;

  const selectedIds = new Set(selectedProducts.map((p) => p.id));

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

  return (
    <BlockStack gap="300">
      {selectedProducts.length > 0 && (
        <InlineStack align="space-between" blockAlign="center">
          <Text as="span" variant="bodySm" fontWeight="semibold">
            {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
          </Text>
          <Button variant="plain" onClick={onClearAll}>
            Clear all
          </Button>
        </InlineStack>
      )}

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
          maxHeight: "400px",
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
            {displayProducts.map((product) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <Box key={product.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(product)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      background: isSelected
                        ? "var(--p-color-bg-surface-selected)"
                        : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          "var(--p-color-bg-surface-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected
                        ? "var(--p-color-bg-surface-selected)"
                        : "transparent";
                    }}
                  >
                    <InlineStack gap="300" blockAlign="center">
                      <Checkbox
                        label=""
                        labelHidden
                        checked={isSelected}
                        onChange={() => onToggle(product)}
                      />
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
              );
            })}
          </BlockStack>
        )}
      </div>
    </BlockStack>
  );
}
