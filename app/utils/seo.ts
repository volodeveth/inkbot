/**
 * Calculate SEO score for a product description.
 * Returns a score from 0-100 based on various SEO factors.
 */
export function calculateSeoScore(params: {
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}): number {
  let score = 0;
  const { title, description, metaTitle, metaDescription, keywords } = params;

  // Title checks (max 20 points)
  if (title) {
    score += 5; // Has title
    if (title.length >= 20 && title.length <= 70) score += 10; // Good length
    if (title.length > 0 && title.length < 20) score += 5; // Too short
    if (keywords?.some((k) => title.toLowerCase().includes(k.toLowerCase()))) {
      score += 5; // Contains keyword
    }
  }

  // Description checks (max 35 points)
  if (description) {
    const textLength = description.replace(/<[^>]*>/g, "").length;
    score += 5; // Has description
    if (textLength >= 150 && textLength <= 1000) score += 10; // Good length
    if (textLength > 1000) score += 5; // A bit long but ok
    if (description.includes("<ul>") || description.includes("<ol>")) {
      score += 5; // Has lists
    }
    if (description.includes("<strong>") || description.includes("<b>")) {
      score += 5; // Has bold text
    }
    if (
      keywords?.some((k) =>
        description.toLowerCase().includes(k.toLowerCase())
      )
    ) {
      score += 10; // Contains keywords
    }
  }

  // Meta title checks (max 20 points)
  if (metaTitle) {
    score += 5; // Has meta title
    if (metaTitle.length >= 30 && metaTitle.length <= 60) score += 10; // Ideal length
    if (
      keywords?.some((k) =>
        metaTitle.toLowerCase().includes(k.toLowerCase())
      )
    ) {
      score += 5; // Contains keyword
    }
  }

  // Meta description checks (max 25 points)
  if (metaDescription) {
    score += 5; // Has meta description
    if (metaDescription.length >= 120 && metaDescription.length <= 155) {
      score += 10; // Ideal length
    }
    if (metaDescription.length >= 80 && metaDescription.length < 120) {
      score += 5; // Acceptable length
    }
    if (
      keywords?.some((k) =>
        metaDescription.toLowerCase().includes(k.toLowerCase())
      )
    ) {
      score += 5; // Contains keyword
    }
    // Call-to-action words
    const ctaWords = ["shop", "buy", "get", "discover", "try", "order", "save"];
    if (
      ctaWords.some((w) => metaDescription.toLowerCase().includes(w))
    ) {
      score += 5; // Has CTA
    }
  }

  return Math.min(100, score);
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed.
 */
export function truncateForMeta(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + "...";
}

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Count words in a text string.
 */
export function wordCount(text: string): number {
  return stripHtml(text)
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}
