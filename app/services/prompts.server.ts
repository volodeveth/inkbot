export interface NicheConfig {
  name: string;
  displayName: string;
  icon: string;
  systemPrompt: string;
  keywordPatterns: string[];
  structureGuide: string;
}

export const NICHE_CONFIGS: Record<string, NicheConfig> = {
  fashion: {
    name: "fashion",
    displayName: "Fashion & Apparel",
    icon: "👗",
    systemPrompt: `
For fashion products, focus on:
- Fabric quality and feel (soft, breathable, luxurious)
- Fit and silhouette (flattering, comfortable, true-to-size)
- Versatility (dress up/down, multiple occasions)
- Style inspiration (pair with, complete the look)
- Care instructions subtly mentioned
- Size guidance when relevant

Use fashion-forward language: "effortlessly chic", "timeless elegance",
"statement piece", "wardrobe essential", "on-trend", "elevated basics"
`,
    keywordPatterns: [
      "women's",
      "men's",
      "dress",
      "casual",
      "formal",
      "comfortable",
    ],
    structureGuide:
      "Opening hook → Style description → Fabric/Quality → Fit → Styling tips → CTA",
  },

  electronics: {
    name: "electronics",
    displayName: "Electronics & Tech",
    icon: "📱",
    systemPrompt: `
For electronics products, focus on:
- Key specifications (but make them understandable)
- Real-world benefits (what problems it solves)
- Compatibility information
- Ease of use
- Build quality and durability
- What's included in the box

Use tech-savvy but accessible language: "seamless connectivity",
"intuitive interface", "lightning-fast", "crystal-clear", "cutting-edge"
Avoid jargon without explanation.
`,
    keywordPatterns: [
      "wireless",
      "bluetooth",
      "smart",
      "portable",
      "rechargeable",
    ],
    structureGuide:
      "Problem solved → Key features → Specs → Compatibility → Warranty → CTA",
  },

  beauty: {
    name: "beauty",
    displayName: "Beauty & Cosmetics",
    icon: "💄",
    systemPrompt: `
For beauty products, focus on:
- Key ingredients and their benefits
- Skin/hair type suitability
- Results and transformation
- Sensory experience (texture, scent, feel)
- How to use / application tips
- Clean/natural/vegan credentials if applicable

Use aspirational beauty language: "radiant glow", "silky smooth",
"nourishing formula", "visible results", "salon-quality", "self-care ritual"
`,
    keywordPatterns: [
      "natural",
      "organic",
      "hydrating",
      "anti-aging",
      "sensitive skin",
    ],
    structureGuide:
      "Benefit promise → Ingredients → How it works → How to use → Results → CTA",
  },

  food: {
    name: "food",
    displayName: "Food & Beverages",
    icon: "🍕",
    systemPrompt: `
For food products, focus on:
- Taste profile and flavor notes
- Quality of ingredients and sourcing
- Dietary information (vegan, gluten-free, keto, etc.)
- Serving suggestions and pairings
- Freshness and storage
- Origin story if relevant

Use appetizing sensory language: "artisanal", "farm-fresh", "rich and creamy",
"perfectly balanced", "hand-crafted", "small-batch"
`,
    keywordPatterns: [
      "organic",
      "natural",
      "gourmet",
      "artisan",
      "gluten-free",
      "vegan",
    ],
    structureGuide:
      "Taste hook → Ingredients quality → Dietary info → Serving ideas → Storage → CTA",
  },

  home: {
    name: "home",
    displayName: "Home & Garden",
    icon: "🏠",
    systemPrompt: `
For home products, focus on:
- Design and aesthetic appeal
- Functionality and practicality
- Materials and craftsmanship
- Dimensions and space considerations
- Care and maintenance
- How it completes a room/space

Use lifestyle language: "transform your space", "cozy comfort",
"modern elegance", "functional beauty", "curated style"
`,
    keywordPatterns: [
      "modern",
      "minimalist",
      "rustic",
      "handmade",
      "durable",
      "easy-care",
    ],
    structureGuide:
      "Design appeal → Functionality → Materials → Dimensions → Care → CTA",
  },

  sports: {
    name: "sports",
    displayName: "Sports & Fitness",
    icon: "🏃",
    systemPrompt: `
For sports/fitness products, focus on:
- Performance benefits
- Durability and quality
- Comfort during activity
- Technical features explained simply
- Suitable activities/sports
- Size/fit guidance

Use motivational active language: "push your limits", "peak performance",
"engineered for athletes", "game-changing", "train harder"
`,
    keywordPatterns: [
      "performance",
      "lightweight",
      "breathable",
      "durable",
      "professional",
    ],
    structureGuide:
      "Performance promise → Features → Comfort → Durability → Sizing → CTA",
  },

  jewelry: {
    name: "jewelry",
    displayName: "Jewelry & Accessories",
    icon: "💎",
    systemPrompt: `
For jewelry products, focus on:
- Materials and craftsmanship
- Design inspiration and meaning
- Versatility (occasions, styling)
- Quality details (clasp, finish, etc.)
- Size/measurements
- Care instructions
- Gift potential

Use elegant luxury language: "exquisite craftsmanship", "timeless elegance",
"statement piece", "heirloom quality", "artisan-crafted"
`,
    keywordPatterns: [
      "handcrafted",
      "sterling silver",
      "14k gold",
      "minimalist",
      "statement",
    ],
    structureGuide:
      "Design story → Materials → Craftsmanship → Measurements → Care → Gift → CTA",
  },

  pets: {
    name: "pets",
    displayName: "Pet Supplies",
    icon: "🐕",
    systemPrompt: `
For pet products, focus on:
- Safety and quality materials
- Benefits for pet health/happiness
- Durability (chew-proof, washable)
- Size suitability for different breeds
- Easy cleaning/maintenance
- How pets will enjoy it

Use warm pet-lover language: "tail-wagging approved", "purr-fect",
"happy and healthy", "built to last", "pet parent favorite"
`,
    keywordPatterns: [
      "non-toxic",
      "durable",
      "washable",
      "all breeds",
      "vet-recommended",
    ],
    structureGuide:
      "Pet benefit → Safety → Durability → Size guide → Maintenance → CTA",
  },

  general: {
    name: "general",
    displayName: "General / Other",
    icon: "📦",
    systemPrompt: `
For general products, create compelling descriptions that:
- Lead with the key benefit
- Explain features in terms of value to customer
- Address potential questions
- Build trust through quality signals
- Include a soft call-to-action
`,
    keywordPatterns: [
      "quality",
      "premium",
      "best-selling",
      "popular",
      "trusted",
    ],
    structureGuide: "Benefit hook → Features → Quality → Details → CTA",
  },
};

export function getPromptForNiche(niche: string): string {
  const config = NICHE_CONFIGS[niche] || NICHE_CONFIGS.general;
  return config.systemPrompt;
}

export function getNicheConfig(niche: string): NicheConfig {
  return NICHE_CONFIGS[niche] || NICHE_CONFIGS.general;
}

export function getAllNiches(): NicheConfig[] {
  return Object.values(NICHE_CONFIGS);
}
