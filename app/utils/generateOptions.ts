export interface GenerateOptions {
  title: boolean;
  description: boolean;
  metaTitle: boolean;
  metaDescription: boolean;
  tags: boolean;
}

export const DEFAULT_GENERATE_OPTIONS: GenerateOptions = {
  title: true,
  description: true,
  metaTitle: true,
  metaDescription: true,
  tags: false,
};
