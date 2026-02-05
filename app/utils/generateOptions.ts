export interface GenerateOptions {
  title: boolean;
  description: boolean;
  metaTitle: boolean;
  metaDescription: boolean;
  keywords: boolean;
}

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  title: true,
  description: true,
  metaTitle: true,
  metaDescription: true,
  keywords: true,
};
