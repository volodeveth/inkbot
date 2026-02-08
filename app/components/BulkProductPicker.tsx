import { useState, useCallback, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import {
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Button,
  Badge,
  Banner,
  Box,
  Thumbnail,
  Spinner,
  Checkbox,
  Select,
  Pagination,
} from "@shopify/polaris";
import { SearchIcon, ImageIcon } from "@shopify/polaris-icons";
import type { ShopifyProduct, ShopifyCollection, PageInfo } from "~/types/shopify";

export type StatusFilter = "all" | "not_generated" | "generated";

interface BulkProductPickerProps {
  products: ShopifyProduct[];
  selectedProducts: ShopifyProduct[];
  onToggle: (product: ShopifyProduct) => void;
  onClearAll: () => void;
  onSelectMany?: (products: ShopifyProduct[]) => void;
  onDeselectMany?: (productIds: string[]) => void;
  collections?: ShopifyCollection[];
  generatedProductIds?: Set<string>;
  selectedCollection: string;
  onCollectionChange: (collectionId: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  initialPageInfo?: PageInfo;
  maxSelection?: number;
}

export function BulkProductPicker({
  products,
  selectedProducts,
  onToggle,
  onClearAll,
  onSelectMany,
  onDeselectMany,
  collections = [],
  generatedProductIds = new Set(),
  selectedCollection,
  onCollectionChange,
  statusFilter,
  onStatusFilterChange,
  initialPageInfo,
  maxSelection,
}: BulkProductPickerProps) {
  const fetcher = useFetcher<{ products: ShopifyProduct[]; pageInfo?: PageInfo }>();
  const [query, setQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSearching = fetcher.state === "submitting" || fetcher.state === "loading";
  const fetchedProducts = fetcher.data?.products ?? products;

  // Track current page info — updated from fetcher or initial loader
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo>(
    initialPageInfo ?? { hasNextPage: false, hasPreviousPage: false, endCursor: null, startCursor: null }
  );

  // Update pageInfo when fetcher returns data
  useEffect(() => {
    if (fetcher.data?.pageInfo) {
      setCurrentPageInfo(fetcher.data.pageInfo);
    }
  }, [fetcher.data]);

  // Apply local status filter
  const displayProducts = fetchedProducts.filter((product) => {
    if (statusFilter === "all") return true;
    const isGenerated = generatedProductIds.has(product.id);
    if (statusFilter === "generated") return isGenerated;
    if (statusFilter === "not_generated") return !isGenerated;
    return true;
  });

  const selectedIds = new Set(selectedProducts.map((p) => p.id));

  // "Select all on page" state
  const allOnPageSelected = displayProducts.length > 0 && displayProducts.every((p) => selectedIds.has(p.id));
  const someOnPageSelected = displayProducts.some((p) => selectedIds.has(p.id));
  const selectAllChecked = allOnPageSelected;
  const selectAllIndeterminate = someOnPageSelected && !allOnPageSelected;

  const handleSelectAllOnPage = useCallback(() => {
    if (allOnPageSelected) {
      // Deselect all on this page
      if (onDeselectMany) {
        onDeselectMany(displayProducts.map((p) => p.id));
      }
    } else {
      // Select all on this page
      if (onSelectMany) {
        onSelectMany(displayProducts);
      }
    }
  }, [allOnPageSelected, displayProducts, onSelectMany, onDeselectMany]);

  // Submit search/filter request (no cursor = page 1)
  const submitSearch = useCallback((searchQuery: string, collection: string) => {
    const formData = new FormData();
    formData.append("_action", "searchProducts");
    formData.append("query", searchQuery);
    if (collection) {
      formData.append("collectionId", collection);
    }
    fetcher.submit(formData, { method: "post" });
  }, [fetcher]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      submitSearch(query, selectedCollection);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, selectedCollection]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleCollectionChange = useCallback((value: string) => {
    onCollectionChange(value);
  }, [onCollectionChange]);

  const handleStatusChange = useCallback((value: string) => {
    onStatusFilterChange(value as StatusFilter);
  }, [onStatusFilterChange]);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    if (!currentPageInfo.endCursor) return;
    const formData = new FormData();
    formData.append("_action", "searchProducts");
    formData.append("query", query);
    if (selectedCollection) {
      formData.append("collectionId", selectedCollection);
    }
    formData.append("after", currentPageInfo.endCursor);
    formData.append("direction", "forward");
    fetcher.submit(formData, { method: "post" });
  }, [currentPageInfo.endCursor, query, selectedCollection, fetcher]);

  const handlePreviousPage = useCallback(() => {
    if (!currentPageInfo.startCursor) return;
    const formData = new FormData();
    formData.append("_action", "searchProducts");
    formData.append("query", query);
    if (selectedCollection) {
      formData.append("collectionId", selectedCollection);
    }
    formData.append("before", currentPageInfo.startCursor);
    formData.append("direction", "backward");
    fetcher.submit(formData, { method: "post" });
  }, [currentPageInfo.startCursor, query, selectedCollection, fetcher]);

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

  const collectionOptions = [
    { label: "All collections", value: "" },
    ...collections.map((c) => ({
      label: `${c.title} (${c.productsCount})`,
      value: c.id,
    })),
  ];

  const statusOptions = [
    { label: "All products", value: "all" },
    { label: "Not generated", value: "not_generated" },
    { label: "Already generated", value: "generated" },
  ];

  return (
    <BlockStack gap="300">
      {selectedProducts.length > 0 && (
        <InlineStack align="space-between" blockAlign="center">
          <Text as="span" variant="bodySm" fontWeight="semibold">
            {selectedProducts.length}{maxSelection ? `/${maxSelection}` : ""} product{selectedProducts.length !== 1 ? "s" : ""} selected
          </Text>
          <Button variant="plain" onClick={onClearAll}>
            Clear all
          </Button>
        </InlineStack>
      )}

      {maxSelection && selectedProducts.length >= maxSelection && (
        <Banner tone="warning">
          <p>Maximum {maxSelection} products per batch. Deselect some to add others.</p>
        </Banner>
      )}

      {/* Filters row */}
      <InlineStack gap="300" wrap>
        <Box minWidth="200px">
          <Select
            label="Collection"
            labelHidden
            options={collectionOptions}
            value={selectedCollection}
            onChange={handleCollectionChange}
          />
        </Box>
        <Box minWidth="160px">
          <Select
            label="Status"
            labelHidden
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </Box>
        <Box minWidth="200px">
          <TextField
            label="Search products"
            labelHidden
            value={query}
            onChange={handleSearch}
            placeholder="Search..."
            prefix={<span style={{ display: "flex" }}><SearchIcon /></span>}
            autoComplete="off"
            suffix={isSearching ? <Spinner size="small" /> : undefined}
          />
        </Box>
      </InlineStack>

      {/* Select all on page */}
      {displayProducts.length > 0 && onSelectMany && onDeselectMany && (
        <Box paddingInlineStart="300">
          <Checkbox
            label={`Select all ${displayProducts.length} on this page`}
            checked={selectAllIndeterminate ? "indeterminate" : selectAllChecked}
            onChange={handleSelectAllOnPage}
          />
        </Box>
      )}

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
              const isGenerated = generatedProductIds.has(product.id);
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
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          label=""
                          labelHidden
                          checked={isSelected}
                          onChange={() => onToggle(product)}
                        />
                      </div>
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
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="span" fontWeight="semibold">
                            {product.title}
                          </Text>
                          {isGenerated && (
                            <Badge tone="info">Generated</Badge>
                          )}
                        </InlineStack>
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
    </BlockStack>
  );
}
