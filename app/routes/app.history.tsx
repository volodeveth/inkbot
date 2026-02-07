import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Select,
  Box,
  EmptyState,
  Pagination,
  Banner,
  TextField,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useRef } from "react";
import { authenticate } from "../shopify.server";
import { getGenerationsByShop } from "~/models/generation.server";
import { getShop } from "~/models/shop.server";
import { hasPlanFeature, type PlanKey } from "~/utils/plans";

const PAGE_SIZE = 10;

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);

  const niche = url.searchParams.get("niche") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * PAGE_SIZE;

  const shop = await getShop(session.shop);
  const plan = (shop?.plan || "FREE") as PlanKey;

  const generations = await getGenerationsByShop(session.shop, {
    take: PAGE_SIZE + 1, // fetch one extra to check if there's a next page
    skip,
    niche: niche === "all" ? undefined : niche,
    search: search || undefined,
  });

  const hasNextPage = generations.length > PAGE_SIZE;
  const items = hasNextPage ? generations.slice(0, PAGE_SIZE) : generations;

  return json({
    generations: items,
    page,
    hasNextPage,
    hasPreviousPage: page > 1,
    currentNiche: niche || "all",
    currentSearch: search || "",
    plan,
  });
}

export default function HistoryPage() {
  const { generations, page, hasNextPage, hasPreviousPage, currentNiche, currentSearch, plan } =
    useLoaderData<typeof loader>();
  const canUseHistory = hasPlanFeature(plan as PlanKey, "history");
  const [searchParams, setSearchParams] = useSearchParams();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNicheChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("niche", value);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        if (value) {
          params.set("search", value);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        setSearchParams(params);
      }, 300);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (direction: "next" | "previous") => {
      const params = new URLSearchParams(searchParams);
      const newPage = direction === "next" ? page + 1 : page - 1;
      params.set("page", String(newPage));
      setSearchParams(params);
    },
    [page, searchParams, setSearchParams]
  );

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const nicheFilterOptions = [
    { label: "All niches", value: "all" },
    { label: "Fashion", value: "fashion" },
    { label: "Electronics", value: "electronics" },
    { label: "Beauty", value: "beauty" },
    { label: "Food", value: "food" },
    { label: "Home", value: "home" },
    { label: "Sports", value: "sports" },
    { label: "Jewelry", value: "jewelry" },
    { label: "Pets", value: "pets" },
    { label: "General", value: "general" },
  ];

  return (
    <Page
      title="Generation History"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {!canUseHistory && (
              <Banner tone="warning" title="Upgrade Required">
                <p>
                  Generation history is available on Starter plan and above.{" "}
                  <Button variant="plain" url="/app/billing">
                    Upgrade your plan
                  </Button>
                </p>
              </Banner>
            )}

            {canUseHistory && <>
            {/* Filter */}
            <Card>
              <InlineStack gap="400" blockAlign="end">
                <Box minWidth="250px">
                  <TextField
                    label="Search by title"
                    labelHidden
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search by product title..."
                    prefix={<span style={{ display: "flex" }}><SearchIcon /></span>}
                    autoComplete="off"
                    clearButton
                    onClearButtonClick={() => handleSearchChange("")}
                  />
                </Box>
                <Box minWidth="200px">
                  <Select
                    label="Filter by niche"
                    options={nicheFilterOptions}
                    value={currentNiche}
                    onChange={handleNicheChange}
                  />
                </Box>
              </InlineStack>
            </Card>

            {/* Results */}
            {generations.length === 0 ? (
              <Card>
                <EmptyState
                  heading="No generations found"
                  image=""
                >
                  <p>
                    {currentSearch
                      ? `No descriptions found matching "${currentSearch}".`
                      : currentNiche !== "all"
                        ? `No descriptions generated for this niche yet.`
                        : `You haven't generated any descriptions yet.`}
                  </p>
                  <Button url="/app/generate">Generate your first</Button>
                </EmptyState>
              </Card>
            ) : (
              <BlockStack gap="300">
                {generations.map((gen: any) => (
                  <Card key={gen.id}>
                    <BlockStack gap="300">
                      {/* Header */}
                      <InlineStack align="space-between" blockAlign="start">
                        <BlockStack gap="100">
                          <Text as="h3" variant="headingMd">
                            {gen.productTitle}
                          </Text>
                          <InlineStack gap="200">
                            <Text as="span" variant="bodySm" tone="subdued">
                              {new Date(gen.createdAt).toLocaleString()}
                            </Text>
                            {gen.productType && (
                              <Text as="span" variant="bodySm" tone="subdued">
                                &middot; {gen.productType}
                              </Text>
                            )}
                          </InlineStack>
                        </BlockStack>
                        <InlineStack gap="200">
                          <Badge>{gen.niche}</Badge>
                          <Badge tone={gen.tone === "luxurious" ? "warning" : "info"}>
                            {gen.tone}
                          </Badge>
                          {gen.seoScore != null && (
                            <Badge
                              tone={
                                gen.seoScore >= 80
                                  ? "success"
                                  : gen.seoScore >= 60
                                    ? "warning"
                                    : "critical"
                              }
                            >
                              {`SEO: ${gen.seoScore}`}
                            </Badge>
                          )}
                          {gen.status === "APPLIED" && (
                            <Badge tone="success">Applied</Badge>
                          )}
                        </InlineStack>
                      </InlineStack>

                      {/* Generated title */}
                      {gen.title && (
                        <Box>
                          <Text as="p" variant="bodySm" fontWeight="semibold">
                            Title:
                          </Text>
                          <Text as="p">{gen.title}</Text>
                        </Box>
                      )}

                      {/* Description preview */}
                      <Box
                        padding="300"
                        background="bg-surface-secondary"
                        borderRadius="200"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              gen.description.length > 300
                                ? gen.description.substring(0, 300) + "..."
                                : gen.description,
                          }}
                        />
                      </Box>

                      {/* Meta */}
                      {(gen.metaTitle || gen.metaDescription) && (
                        <Box>
                          {gen.metaTitle && (
                            <Text as="p" variant="bodySm">
                              <strong>Meta Title:</strong> {gen.metaTitle}
                            </Text>
                          )}
                          {gen.metaDescription && (
                            <Text as="p" variant="bodySm">
                              <strong>Meta Description:</strong>{" "}
                              {gen.metaDescription}
                            </Text>
                          )}
                        </Box>
                      )}

                      {/* Actions */}
                      <InlineStack gap="200">
                        <Button
                          size="slim"
                          onClick={() => handleCopy(gen.id, gen.description)}
                        >
                          {copiedId === gen.id ? "Copied!" : "Copy Description"}
                        </Button>
                        <Button
                          size="slim"
                          variant="plain"
                          onClick={() =>
                            handleCopy(
                              gen.id + "_all",
                              `${gen.title || ""}\n\n${gen.description}\n\nMeta Title: ${gen.metaTitle || ""}\nMeta Description: ${gen.metaDescription || ""}`
                            )
                          }
                        >
                          {copiedId === gen.id + "_all" ? "Copied!" : "Copy All"}
                        </Button>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                ))}

                {/* Pagination */}
                <InlineStack align="center">
                  <Pagination
                    hasPrevious={hasPreviousPage}
                    hasNext={hasNextPage}
                    onPrevious={() => handlePageChange("previous")}
                    onNext={() => handlePageChange("next")}
                  />
                </InlineStack>
              </BlockStack>
            )}
            </>}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
