import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Box,
  Button,
  Divider,
  Tag,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { SeoScoreBadge } from "./SeoScoreBadge";

interface GenerationCardProps {
  title?: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  seoScore?: number;
  suggestedKeywords?: string[];
  onApply?: () => void;
  showApply?: boolean;
}

export function GenerationCard({
  title,
  description,
  metaTitle,
  metaDescription,
  seoScore,
  suggestedKeywords,
  onApply,
  showApply = false,
}: GenerationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Card>
      <BlockStack gap="400">
        {/* SEO Score */}
        {seoScore != null && (
          <>
            <InlineStack align="space-between" blockAlign="center">
              <Text as="span" fontWeight="semibold">SEO Score</Text>
              <SeoScoreBadge score={seoScore} />
            </InlineStack>
            <Divider />
          </>
        )}

        {/* Title */}
        {title && (
          <BlockStack gap="200">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              Optimized Title
            </Text>
            <Box padding="300" background="bg-surface-secondary" borderRadius="200">
              <Text as="p">{title}</Text>
            </Box>
          </BlockStack>
        )}

        {/* Description */}
        <BlockStack gap="200">
          <Text as="span" variant="bodySm" fontWeight="semibold">
            Product Description
          </Text>
          <Box padding="300" background="bg-surface-secondary" borderRadius="200">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </Box>
        </BlockStack>

        {/* Meta */}
        {metaTitle && (
          <BlockStack gap="200">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              Meta Title
            </Text>
            <Box padding="200" background="bg-surface-secondary" borderRadius="200">
              <Text as="p" variant="bodySm">{metaTitle}</Text>
            </Box>
          </BlockStack>
        )}

        {metaDescription && (
          <BlockStack gap="200">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              Meta Description
            </Text>
            <Box padding="200" background="bg-surface-secondary" borderRadius="200">
              <Text as="p" variant="bodySm">{metaDescription}</Text>
            </Box>
          </BlockStack>
        )}

        {/* Keywords */}
        {suggestedKeywords && suggestedKeywords.length > 0 && (
          <BlockStack gap="200">
            <Text as="span" variant="bodySm" fontWeight="semibold">
              Suggested Keywords
            </Text>
            <InlineStack gap="200" wrap>
              {suggestedKeywords.map((kw, i) => (
                <Tag key={i}>{kw}</Tag>
              ))}
            </InlineStack>
          </BlockStack>
        )}

        <Divider />

        {/* Actions */}
        <InlineStack gap="200">
          {showApply && onApply && (
            <Button variant="primary" onClick={onApply}>
              Apply to Product
            </Button>
          )}
          <Button onClick={() => handleCopy(description)}>
            {copied ? "Copied!" : "Copy Description"}
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
