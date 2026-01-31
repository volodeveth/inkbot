import { Badge } from "@shopify/polaris";

interface SeoScoreBadgeProps {
  score: number;
}

export function SeoScoreBadge({ score }: SeoScoreBadgeProps) {
  const tone =
    score >= 80 ? "success" : score >= 60 ? "warning" : "critical";

  return <Badge tone={tone}>{`SEO: ${score}/100`}</Badge>;
}
