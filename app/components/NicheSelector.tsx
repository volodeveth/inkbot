import { Select } from "@shopify/polaris";
import { getAllNiches } from "~/services/prompts.server";

interface NicheSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const NICHE_OPTIONS = [
  { label: "📦 General / Other", value: "general" },
  { label: "👗 Fashion & Apparel", value: "fashion" },
  { label: "📱 Electronics & Tech", value: "electronics" },
  { label: "💄 Beauty & Cosmetics", value: "beauty" },
  { label: "🍕 Food & Beverages", value: "food" },
  { label: "🏠 Home & Garden", value: "home" },
  { label: "🏃 Sports & Fitness", value: "sports" },
  { label: "💎 Jewelry & Accessories", value: "jewelry" },
  { label: "🐕 Pet Supplies", value: "pets" },
];

export function NicheSelector({
  value,
  onChange,
  label = "Niche",
}: NicheSelectorProps) {
  return (
    <Select
      label={label}
      options={NICHE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
