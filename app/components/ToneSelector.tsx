import { Select } from "@shopify/polaris";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const TONE_OPTIONS = [
  { label: "Professional", value: "professional" },
  { label: "Casual & Friendly", value: "casual" },
  { label: "Luxurious", value: "luxurious" },
  { label: "Playful", value: "playful" },
  { label: "Technical", value: "technical" },
  { label: "Minimalist", value: "minimalist" },
];

export function ToneSelector({
  value,
  onChange,
  label = "Tone",
}: ToneSelectorProps) {
  return (
    <Select
      label={label}
      options={TONE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
