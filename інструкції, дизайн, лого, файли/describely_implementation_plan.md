# 🚀 Describely — Shopify App Implementation Plan
## AI Product Description Generator for Niche Markets
## 🌐 describely.app

---

## 📋 PROJECT OVERVIEW

### App Name: **Describely**
### Domain: **describely.app**

### Value Proposition:
> "Створюй унікальні, SEO-оптимізовані описи товарів у голосі твого бренду за секунди"

### Key Differentiators:
1. **Niche-specific templates** (fashion, electronics, food, beauty, home)
2. **Brand voice learning** — аналізує існуючі описи і копіює стиль
3. **Competitor analysis** — порівнює з топ-магазинами
4. **SEO optimization** — keywords, meta descriptions, структура
5. **Bulk generation** — 100+ описів за раз

---

## 🚀 QUICK START (Vercel + Neon)

### 5-Minute Setup:

```bash
# 1. Create Shopify app
npx @shopify/create-app@latest describely
cd describely

# 2. Install dependencies
npm install @anthropic-ai/sdk @neondatabase/serverless @prisma/adapter-neon ws
npm install -D @types/ws

# 3. Login to Vercel
npx vercel login

# 4. Create Neon database (or via neon.tech dashboard)
# Copy connection strings

# 5. Add env variables to Vercel
npx vercel env add DATABASE_URL      # pooled connection
npx vercel env add DIRECT_URL        # direct connection  
npx vercel env add ANTHROPIC_API_KEY
npx vercel env add SHOPIFY_API_KEY
npx vercel env add SHOPIFY_API_SECRET

# 6. Deploy
npx vercel --prod

# 7. Run migrations
npx prisma db push
```

### Vercel + Neon Integration (Recommended):

Vercel має вбудовану інтеграцію з Neon:

1. **Vercel Dashboard** → **Storage** → **Create Database**
2. Вибери **Neon Serverless Postgres**
3. Vercel автоматично додасть `DATABASE_URL` і `DATABASE_URL_UNPOOLED`
4. Done! 🎉

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOPIFY ADMIN                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Describely App (Embedded)                │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐  │   │
│  │  │Dashboard│ │Generator│ │ Bulk    │ │ Settings │  │   │
│  │  │         │ │  Page   │ │  Page   │ │  Page    │  │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ App Bridge
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL (Serverless)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Remix + Node.js                      │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐  │  │
│  │  │ Auth   │ │Products│ │Generate│ │   Billing    │  │  │
│  │  │ Routes │ │ Routes │ │ Routes │ │   Routes     │  │  │
│  │  └────────┘ └────────┘ └────────┘ └──────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │              │                    │
          ▼              ▼                    ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────────────┐
│   Shopify    │ │   Claude     │  │   Neon PostgreSQL    │
│   GraphQL    │ │    API       │  │     (Serverless)     │
│     API      │ │              │  │  ┌───────────────┐  │
│              │ │              │  │  │ shops         │  │
│              │ │              │  │  │ generations   │  │
│              │ │              │  │  │ brand_voices  │  │
│              │ │              │  │  │ templates     │  │
└──────────────┘ └──────────────┘  │  │ usage_logs    │  │
                                   │  └───────────────┘  │
                                   └──────────────────────┘
```

### Tech Stack:
| Component | Technology | Why |
|-----------|------------|-----|
| **Frontend** | React + Polaris | Official Shopify UI kit |
| **Backend** | Remix (Node.js) | Official Shopify template |
| **Hosting** | Vercel | Free tier, auto-scaling, easy deploys |
| **Database** | Neon PostgreSQL | Serverless, free tier, Vercel integration |
| **AI** | Claude API | Cheaper than GPT-4, better quality |
| **Payments** | Shopify Billing API | Built-in, required for App Store |

---

## 📁 PROJECT STRUCTURE

```
describely/
├── app/
│   ├── routes/
│   │   ├── app._index.tsx           # Dashboard
│   │   ├── app.generate.tsx         # Single product generator
│   │   ├── app.bulk.tsx             # Bulk generation
│   │   ├── app.settings.tsx         # Brand voice & preferences
│   │   ├── app.history.tsx          # Generation history
│   │   ├── app.billing.tsx          # Subscription management
│   │   ├── api.generate.tsx         # API endpoint for generation
│   │   ├── api.bulk-generate.tsx    # API for bulk
│   │   ├── api.analyze-voice.tsx    # Brand voice analysis
│   │   ├── auth.$.tsx               # Shopify OAuth
│   │   └── webhooks.tsx             # Shopify webhooks
│   │
│   ├── components/
│   │   ├── ProductSelector.tsx      # Product picker
│   │   ├── DescriptionEditor.tsx    # Rich text editor
│   │   ├── NicheSelector.tsx        # Niche dropdown
│   │   ├── ToneSelector.tsx         # Tone of voice
│   │   ├── GenerationCard.tsx       # Result display
│   │   ├── UsageCounter.tsx         # Credits remaining
│   │   ├── BulkUploader.tsx         # CSV upload
│   │   └── CompetitorInput.tsx      # Competitor URLs
│   │
│   ├── services/
│   │   ├── claude.server.ts         # Claude API integration
│   │   ├── shopify.server.ts        # Shopify API helpers
│   │   ├── billing.server.ts        # Billing logic
│   │   ├── usage.server.ts          # Usage tracking
│   │   └── prompts.server.ts        # AI prompts library
│   │
│   ├── models/
│   │   ├── shop.server.ts           # Shop model
│   │   ├── generation.server.ts     # Generation history
│   │   ├── brandVoice.server.ts     # Brand voice settings
│   │   └── template.server.ts       # Niche templates
│   │
│   └── utils/
│       ├── seo.ts                   # SEO helpers
│       ├── text.ts                  # Text processing
│       └── validation.ts            # Input validation
│
├── prisma/
│   └── schema.prisma                # Database schema
│
├── public/
│   └── assets/
│
├── .env                             # Environment variables
├── package.json
├── shopify.app.toml                 # Shopify app config
├── remix.config.js
└── README.md
```

---

## 🗄️ DATABASE SCHEMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Shopify Session (required for Shopify)
model Session {
  id            String    @id
  shop          String
  state         String
  isOnline      Boolean   @default(false)
  scope         String?
  expires       DateTime?
  accessToken   String
  userId        BigInt?
  firstName     String?
  lastName      String?
  email         String?
  accountOwner  Boolean   @default(false)
  locale        String?
  collaborator  Boolean?  @default(false)
  emailVerified Boolean?  @default(false)
}

// Shop settings and subscription
model Shop {
  id                String   @id @default(cuid())
  shopDomain        String   @unique
  accessToken       String
  
  // Subscription
  plan              Plan     @default(FREE)
  subscriptionId    String?
  subscriptionStatus String?
  
  // Usage
  generationsUsed   Int      @default(0)
  generationsLimit  Int      @default(10)
  resetDate         DateTime @default(now())
  
  // Settings
  defaultNiche      String?
  defaultTone       String?
  defaultLanguage   String   @default("en")
  
  // Relations
  brandVoice        BrandVoice?
  generations       Generation[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum Plan {
  FREE
  STARTER
  PRO
  UNLIMITED
}

// Brand voice configuration
model BrandVoice {
  id              String   @id @default(cuid())
  shopId          String   @unique
  shop            Shop     @relation(fields: [shopId], references: [id])
  
  // Analyzed from existing descriptions
  tone            String?  // "professional", "casual", "luxurious", etc.
  style           String?  // "minimalist", "detailed", "storytelling"
  keywords        String[] // Brand-specific keywords
  avoidWords      String[] // Words to avoid
  sampleTexts     String[] // Example descriptions for learning
  
  // Custom instructions
  customPrompt    String?  // Additional instructions
  targetAudience  String?
  brandValues     String[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Generation history
model Generation {
  id              String   @id @default(cuid())
  shopId          String
  shop            Shop     @relation(fields: [shopId], references: [id])
  
  // Product info
  productId       String?  // Shopify product ID
  productTitle    String
  productType     String?
  
  // Input
  niche           String
  tone            String
  keywords        String[]
  competitorUrls  String[]
  
  // Output
  title           String?
  description     String
  metaTitle       String?
  metaDescription String?
  seoScore        Int?
  
  // Status
  status          GenerationStatus @default(COMPLETED)
  appliedAt       DateTime?        // When applied to Shopify
  
  // Metrics
  tokensUsed      Int      @default(0)
  generationTime  Int      @default(0) // ms
  
  createdAt       DateTime @default(now())
}

enum GenerationStatus {
  PENDING
  COMPLETED
  FAILED
  APPLIED
}

// Niche templates
model NicheTemplate {
  id              String   @id @default(cuid())
  
  niche           String   @unique // "fashion", "electronics", etc.
  displayName     String
  icon            String?
  
  // Prompt components
  systemPrompt    String
  exampleInputs   Json     // Example product data
  exampleOutputs  Json     // Example descriptions
  
  // SEO settings
  keywordPatterns String[]
  structureGuide  String
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 🔧 IMPLEMENTATION STEPS FOR CLAUDE CODE

### PHASE 1: Project Setup (Day 1)

```bash
# Step 1: Create Shopify app using official template
npx @shopify/create-app@latest describely

# Step 2: Choose Remix template
# Select: Remix
# Select: JavaScript/TypeScript (choose TypeScript)

# Step 3: Navigate to project
cd describely

# Step 4: Install additional dependencies
npm install @anthropic-ai/sdk prisma @prisma/client 
npm install zod cheerio node-html-parser
npm install -D @types/node

# Step 5: Initialize Prisma
npx prisma init

# Step 6: Set up environment variables
```

---

## 🌐 VERCEL + NEON SETUP

### Step 1: Create Neon Database

1. Йди на https://neon.tech
2. Sign up / Login
3. Create New Project → Name: `describely-db`
4. Вибери Region: `eu-central-1` (Frankfurt) — найближче до України
5. Скопіюй Connection String

**Neon Dashboard → Connection Details:**
```
# Вибери "Prisma" у dropdown
postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Step 2: Configure Prisma for Neon

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"]  // Для Neon serverless
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Для migrations
}

// ... rest of schema
```

### Step 3: Create `.env` files

**`.env` (local development):**
```env
# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_products,write_products
HOST=https://describely.app

# Database (Neon)
# Connection pooling URL (для app runtime)
DATABASE_URL="postgresql://username:password@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
# Direct connection URL (для migrations)
DIRECT_URL="postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"

# Claude AI
ANTHROPIC_API_KEY=your_anthropic_key

# App settings
NODE_ENV=development
```

> ⚠️ **Важливо:** Neon дає два URL:
> - **Pooled connection** (`-pooler` в хості) — для app runtime
> - **Direct connection** — для Prisma migrations

### Step 4: Vercel Project Setup

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project (run in project root)
vercel link

# 4. Add environment variables
vercel env add SHOPIFY_API_KEY
vercel env add SHOPIFY_API_SECRET
vercel env add SCOPES
vercel env add HOST
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add ANTHROPIC_API_KEY

# 5. Deploy
vercel --prod
```

### Step 5: Configure `vercel.json`

```json
{
  "buildCommand": "prisma generate && remix build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "remix",
  "regions": ["fra1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 6: Update `package.json` scripts

```json
{
  "scripts": {
    "build": "prisma generate && remix build",
    "dev": "remix dev",
    "start": "remix-serve build",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy",
    "db:studio": "prisma studio"
  }
}
```

### Step 7: Prisma Client for Serverless (Vercel Edge)

```typescript
// app/db.server.ts

import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  // For serverless environments (Vercel)
  if (process.env.NODE_ENV === 'production') {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  }
  
  // For development
  return new PrismaClient();
}

export const prisma = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
```

**Додаткові пакети для Neon:**
```bash
npm install @neondatabase/serverless @prisma/adapter-neon ws
npm install -D @types/ws
```

---

### PHASE 2: Core Backend Services (Days 2-3)

#### 2.1 Claude AI Service

```typescript
// app/services/claude.server.ts

import Anthropic from '@anthropic-ai/sdk';
import { getPromptForNiche } from './prompts.server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateDescriptionInput {
  productTitle: string;
  productType?: string;
  existingDescription?: string;
  features?: string[];
  niche: string;
  tone: string;
  targetAudience?: string;
  keywords?: string[];
  brandVoice?: {
    style?: string;
    customPrompt?: string;
    sampleTexts?: string[];
  };
  competitorDescriptions?: string[];
  language?: string;
}

export interface GeneratedDescription {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  suggestedKeywords: string[];
  seoScore: number;
  tokensUsed: number;
}

export async function generateProductDescription(
  input: GenerateDescriptionInput
): Promise<GeneratedDescription> {
  const systemPrompt = buildSystemPrompt(input);
  const userPrompt = buildUserPrompt(input);

  const startTime = Date.now();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const generationTime = Date.now() - startTime;
  const content = response.content[0];
  
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const parsed = parseGeneratedContent(content.text);
  
  return {
    ...parsed,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  };
}

function buildSystemPrompt(input: GenerateDescriptionInput): string {
  const nichePrompt = getPromptForNiche(input.niche);
  
  let systemPrompt = `You are an expert e-commerce copywriter specializing in ${input.niche} products.
Your task is to create compelling, SEO-optimized product descriptions that convert visitors into buyers.

${nichePrompt}

TONE: ${input.tone}
${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ''}
LANGUAGE: ${input.language || 'English'}

RULES:
1. Write unique, engaging content - never copy generic supplier descriptions
2. Focus on benefits, not just features
3. Use sensory language and emotional triggers
4. Include natural keyword placement for SEO
5. Keep paragraphs short and scannable
6. Add a compelling hook in the first sentence
7. End with a subtle call-to-action`;

  if (input.brandVoice?.customPrompt) {
    systemPrompt += `\n\nBRAND VOICE INSTRUCTIONS:\n${input.brandVoice.customPrompt}`;
  }

  if (input.brandVoice?.sampleTexts?.length) {
    systemPrompt += `\n\nBRAND VOICE EXAMPLES (match this style):\n`;
    input.brandVoice.sampleTexts.forEach((text, i) => {
      systemPrompt += `Example ${i + 1}: "${text.substring(0, 300)}..."\n`;
    });
  }

  return systemPrompt;
}

function buildUserPrompt(input: GenerateDescriptionInput): string {
  let prompt = `Create a product description for:

PRODUCT: ${input.productTitle}
${input.productType ? `TYPE: ${input.productType}` : ''}
${input.features?.length ? `FEATURES:\n${input.features.map(f => `- ${f}`).join('\n')}` : ''}
${input.existingDescription ? `CURRENT DESCRIPTION (improve this):\n${input.existingDescription}` : ''}
${input.keywords?.length ? `TARGET KEYWORDS: ${input.keywords.join(', ')}` : ''}`;

  if (input.competitorDescriptions?.length) {
    prompt += `\n\nCOMPETITOR DESCRIPTIONS (differentiate from these):\n`;
    input.competitorDescriptions.forEach((desc, i) => {
      prompt += `Competitor ${i + 1}: "${desc.substring(0, 200)}..."\n`;
    });
  }

  prompt += `

Please respond in the following JSON format:
{
  "title": "Optimized product title (max 70 chars)",
  "description": "Full HTML product description with <p>, <ul>, <strong> tags",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 155 chars)",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
  "seoScore": 85
}`;

  return prompt;
}

function parseGeneratedContent(text: string): Omit<GeneratedDescription, 'tokensUsed'> {
  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      title: parsed.title || '',
      description: parsed.description || '',
      metaTitle: parsed.metaTitle || '',
      metaDescription: parsed.metaDescription || '',
      suggestedKeywords: parsed.suggestedKeywords || [],
      seoScore: parsed.seoScore || 70,
    };
  } catch (error) {
    // Fallback parsing if JSON fails
    return {
      title: '',
      description: text,
      metaTitle: '',
      metaDescription: '',
      suggestedKeywords: [],
      seoScore: 70,
    };
  }
}

// Bulk generation with rate limiting
export async function generateBulkDescriptions(
  products: GenerateDescriptionInput[],
  onProgress?: (completed: number, total: number) => void
): Promise<GeneratedDescription[]> {
  const results: GeneratedDescription[] = [];
  const batchSize = 3; // Process 3 at a time
  
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(product => generateProductDescription(product))
    );
    
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(results.length, products.length);
    }
    
    // Rate limiting delay
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

#### 2.2 Niche Prompts Library

```typescript
// app/services/prompts.server.ts

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
    name: 'fashion',
    displayName: 'Fashion & Apparel',
    icon: '👗',
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
    keywordPatterns: ['women\'s', 'men\'s', 'dress', 'casual', 'formal', 'comfortable'],
    structureGuide: 'Opening hook → Style description → Fabric/Quality → Fit → Styling tips → CTA'
  },

  electronics: {
    name: 'electronics',
    displayName: 'Electronics & Tech',
    icon: '📱',
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
    keywordPatterns: ['wireless', 'bluetooth', 'smart', 'portable', 'rechargeable'],
    structureGuide: 'Problem solved → Key features → Specs → Compatibility → Warranty → CTA'
  },

  beauty: {
    name: 'beauty',
    displayName: 'Beauty & Cosmetics',
    icon: '💄',
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
    keywordPatterns: ['natural', 'organic', 'hydrating', 'anti-aging', 'sensitive skin'],
    structureGuide: 'Benefit promise → Ingredients → How it works → How to use → Results → CTA'
  },

  food: {
    name: 'food',
    displayName: 'Food & Beverages',
    icon: '🍕',
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
    keywordPatterns: ['organic', 'natural', 'gourmet', 'artisan', 'gluten-free', 'vegan'],
    structureGuide: 'Taste hook → Ingredients quality → Dietary info → Serving ideas → Storage → CTA'
  },

  home: {
    name: 'home',
    displayName: 'Home & Garden',
    icon: '🏠',
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
    keywordPatterns: ['modern', 'minimalist', 'rustic', 'handmade', 'durable', 'easy-care'],
    structureGuide: 'Design appeal → Functionality → Materials → Dimensions → Care → CTA'
  },

  sports: {
    name: 'sports',
    displayName: 'Sports & Fitness',
    icon: '🏃',
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
    keywordPatterns: ['performance', 'lightweight', 'breathable', 'durable', 'professional'],
    structureGuide: 'Performance promise → Features → Comfort → Durability → Sizing → CTA'
  },

  jewelry: {
    name: 'jewelry',
    displayName: 'Jewelry & Accessories',
    icon: '💎',
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
    keywordPatterns: ['handcrafted', 'sterling silver', '14k gold', 'minimalist', 'statement'],
    structureGuide: 'Design story → Materials → Craftsmanship → Measurements → Care → Gift → CTA'
  },

  pets: {
    name: 'pets',
    displayName: 'Pet Supplies',
    icon: '🐕',
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
    keywordPatterns: ['non-toxic', 'durable', 'washable', 'all breeds', 'vet-recommended'],
    structureGuide: 'Pet benefit → Safety → Durability → Size guide → Maintenance → CTA'
  },

  general: {
    name: 'general',
    displayName: 'General / Other',
    icon: '📦',
    systemPrompt: `
For general products, create compelling descriptions that:
- Lead with the key benefit
- Explain features in terms of value to customer
- Address potential questions
- Build trust through quality signals
- Include a soft call-to-action
`,
    keywordPatterns: ['quality', 'premium', 'best-selling', 'popular', 'trusted'],
    structureGuide: 'Benefit hook → Features → Quality → Details → CTA'
  }
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
```

#### 2.3 Usage & Billing Service

```typescript
// app/services/billing.server.ts

import { prisma } from '~/db.server';
import { Plan } from '@prisma/client';

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 10,
  STARTER: 100,
  PRO: 500,
  UNLIMITED: 999999,
};

export const PLAN_PRICES: Record<Plan, number> = {
  FREE: 0,
  STARTER: 19,
  PRO: 49,
  UNLIMITED: 99,
};

export async function checkUsageLimit(shopDomain: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
}> {
  const shop = await prisma.shop.findUnique({
    where: { shopDomain },
  });

  if (!shop) {
    return { allowed: false, used: 0, limit: 0, plan: Plan.FREE };
  }

  // Check if we need to reset monthly counter
  const now = new Date();
  const resetDate = new Date(shop.resetDate);
  
  if (now.getMonth() !== resetDate.getMonth() || 
      now.getFullYear() !== resetDate.getFullYear()) {
    // Reset counter for new month
    await prisma.shop.update({
      where: { shopDomain },
      data: {
        generationsUsed: 0,
        resetDate: now,
      },
    });
    return { 
      allowed: true, 
      used: 0, 
      limit: PLAN_LIMITS[shop.plan],
      plan: shop.plan 
    };
  }

  const limit = PLAN_LIMITS[shop.plan];
  const allowed = shop.generationsUsed < limit;

  return {
    allowed,
    used: shop.generationsUsed,
    limit,
    plan: shop.plan,
  };
}

export async function incrementUsage(shopDomain: string, count: number = 1): Promise<void> {
  await prisma.shop.update({
    where: { shopDomain },
    data: {
      generationsUsed: { increment: count },
    },
  });
}

export async function createSubscription(
  shopDomain: string,
  plan: Plan,
  admin: any // Shopify admin API
): Promise<string> {
  if (plan === Plan.FREE) {
    await prisma.shop.update({
      where: { shopDomain },
      data: {
        plan: Plan.FREE,
        generationsLimit: PLAN_LIMITS.FREE,
      },
    });
    return '';
  }

  // Create Shopify subscription
  const response = await admin.graphql(`
    mutation createSubscription($name: String!, $price: Decimal!, $returnUrl: URL!) {
      appSubscriptionCreate(
        name: $name,
        returnUrl: $returnUrl,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: $price, currencyCode: USD }
                interval: EVERY_30_DAYS
              }
            }
          }
        ]
      ) {
        appSubscription {
          id
        }
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      name: `Describely ${plan} Plan`,
      price: PLAN_PRICES[plan],
      returnUrl: `${process.env.HOST}/app/billing/confirm`,
    },
  });

  const data = await response.json();
  
  if (data.data?.appSubscriptionCreate?.userErrors?.length) {
    throw new Error(data.data.appSubscriptionCreate.userErrors[0].message);
  }

  return data.data.appSubscriptionCreate.confirmationUrl;
}
```

---

### PHASE 3: Frontend Components (Days 4-5)

#### 3.1 Main Dashboard

```typescript
// app/routes/app._index.tsx

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  ProgressBar,
  Badge,
  Icon,
} from "@shopify/polaris";
import { 
  ProductIcon, 
  SettingsIcon, 
  ClockIcon,
  ChartVerticalFilledIcon 
} from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";
import { checkUsageLimit } from "~/services/billing.server";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  const usage = await checkUsageLimit(session.shop);
  
  const recentGenerations = await prisma.generation.findMany({
    where: { 
      shop: { shopDomain: session.shop } 
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const stats = await prisma.generation.aggregate({
    where: { 
      shop: { shopDomain: session.shop } 
    },
    _count: true,
    _avg: { seoScore: true },
  });

  return json({
    shop: session.shop,
    usage,
    recentGenerations,
    stats: {
      totalGenerations: stats._count,
      avgSeoScore: Math.round(stats._avg.seoScore || 0),
    },
  });
}

export default function Dashboard() {
  const { usage, recentGenerations, stats } = useLoaderData<typeof loader>();
  
  const usagePercent = (usage.used / usage.limit) * 100;

  return (
    <Page title="Describely Dashboard">
      <BlockStack gap="500">
        {/* Usage Card */}
        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Monthly Usage
                </Text>
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodyMd">
                      {usage.used} / {usage.limit} descriptions
                    </Text>
                    <Badge tone={usage.plan === 'FREE' ? 'info' : 'success'}>
                      {usage.plan}
                    </Badge>
                  </InlineStack>
                  <ProgressBar 
                    progress={usagePercent} 
                    tone={usagePercent > 80 ? 'critical' : 'primary'}
                  />
                </BlockStack>
                {usage.plan === 'FREE' && (
                  <Button variant="primary" url="/app/billing">
                    Upgrade for More
                  </Button>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Total Generated
                </Text>
                <Text as="p" variant="headingXl">
                  {stats.totalGenerations}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  descriptions created
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Avg SEO Score
                </Text>
                <Text as="p" variant="headingXl">
                  {stats.avgSeoScore}/100
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  across all descriptions
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Quick Actions */}
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Quick Actions
            </Text>
            <InlineStack gap="300">
              <Button 
                variant="primary" 
                icon={ProductIcon}
                url="/app/generate"
              >
                Generate Description
              </Button>
              <Button 
                icon={ProductIcon}
                url="/app/bulk"
              >
                Bulk Generate
              </Button>
              <Button 
                icon={SettingsIcon}
                url="/app/settings"
              >
                Brand Voice Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Recent Generations */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Recent Generations
              </Text>
              <Button plain url="/app/history">
                View All
              </Button>
            </InlineStack>
            
            {recentGenerations.length === 0 ? (
              <Text as="p" tone="subdued">
                No descriptions generated yet. Start by generating your first one!
              </Text>
            ) : (
              <BlockStack gap="300">
                {recentGenerations.map((gen) => (
                  <Card key={gen.id} padding="300">
                    <InlineStack align="space-between">
                      <BlockStack gap="100">
                        <Text as="span" variant="bodyMd" fontWeight="semibold">
                          {gen.productTitle}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          {new Date(gen.createdAt).toLocaleDateString()}
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200">
                        <Badge>{gen.niche}</Badge>
                        <Badge tone="success">SEO: {gen.seoScore}</Badge>
                      </InlineStack>
                    </InlineStack>
                  </Card>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
```

#### 3.2 Generation Page

```typescript
// app/routes/app.generate.tsx

import { useState, useCallback } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Select,
  Button,
  Banner,
  Spinner,
  Box,
  Divider,
  Tag,
  ResourcePicker,
} from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import { generateProductDescription } from "~/services/claude.server";
import { checkUsageLimit, incrementUsage } from "~/services/billing.server";
import { getAllNiches } from "~/services/prompts.server";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  const usage = await checkUsageLimit(session.shop);
  const niches = getAllNiches();
  
  const brandVoice = await prisma.brandVoice.findUnique({
    where: { 
      shop: { shopDomain: session.shop }
    },
  });

  return json({ usage, niches, brandVoice });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "generate") {
    // Check usage limit
    const usage = await checkUsageLimit(session.shop);
    if (!usage.allowed) {
      return json({ 
        error: "Usage limit reached. Please upgrade your plan.",
        success: false 
      });
    }

    try {
      const input = {
        productTitle: formData.get("productTitle") as string,
        productType: formData.get("productType") as string,
        existingDescription: formData.get("existingDescription") as string,
        features: (formData.get("features") as string)?.split("\n").filter(Boolean),
        niche: formData.get("niche") as string,
        tone: formData.get("tone") as string,
        keywords: (formData.get("keywords") as string)?.split(",").map(k => k.trim()).filter(Boolean),
        language: formData.get("language") as string || "en",
      };

      const result = await generateProductDescription(input);

      // Save to database
      const shop = await prisma.shop.findUnique({
        where: { shopDomain: session.shop },
      });

      await prisma.generation.create({
        data: {
          shopId: shop!.id,
          productTitle: input.productTitle,
          productType: input.productType,
          niche: input.niche,
          tone: input.tone,
          keywords: input.keywords || [],
          competitorUrls: [],
          title: result.title,
          description: result.description,
          metaTitle: result.metaTitle,
          metaDescription: result.metaDescription,
          seoScore: result.seoScore,
          tokensUsed: result.tokensUsed,
        },
      });

      // Increment usage
      await incrementUsage(session.shop);

      return json({ 
        success: true, 
        result,
        newUsage: usage.used + 1,
      });

    } catch (error) {
      console.error("Generation error:", error);
      return json({ 
        error: "Failed to generate description. Please try again.",
        success: false 
      });
    }
  }

  if (action === "apply") {
    // Apply description to Shopify product
    const productId = formData.get("productId") as string;
    const description = formData.get("description") as string;
    const title = formData.get("title") as string;

    try {
      await admin.graphql(`
        mutation updateProduct($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              descriptionHtml
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            id: productId,
            title: title,
            descriptionHtml: description,
          },
        },
      });

      return json({ success: true, applied: true });
    } catch (error) {
      return json({ 
        error: "Failed to update product",
        success: false 
      });
    }
  }

  return json({ success: false });
}

export default function GeneratePage() {
  const { usage, niches } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const isGenerating = navigation.state === "submitting";

  const [formState, setFormState] = useState({
    productTitle: "",
    productType: "",
    existingDescription: "",
    features: "",
    niche: "general",
    tone: "professional",
    keywords: "",
    language: "en",
  });

  const [showPicker, setShowPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const toneOptions = [
    { label: "Professional", value: "professional" },
    { label: "Casual & Friendly", value: "casual" },
    { label: "Luxurious", value: "luxurious" },
    { label: "Playful", value: "playful" },
    { label: "Technical", value: "technical" },
    { label: "Minimalist", value: "minimalist" },
  ];

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Ukrainian", value: "uk" },
    { label: "German", value: "de" },
    { label: "French", value: "fr" },
    { label: "Spanish", value: "es" },
  ];

  const handleProductSelect = useCallback((resources: any) => {
    const product = resources.selection[0];
    setSelectedProduct(product);
    setFormState(prev => ({
      ...prev,
      productTitle: product.title,
      productType: product.productType || "",
      existingDescription: product.descriptionHtml || "",
    }));
    setShowPicker(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("_action", "generate");
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    submit(formData, { method: "post" });
  }, [formState, submit]);

  return (
    <Page
      title="Generate Description"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Usage Warning */}
            {!usage.allowed && (
              <Banner tone="warning" title="Usage Limit Reached">
                <p>
                  You've used all {usage.limit} descriptions this month.
                  <Button plain url="/app/billing">Upgrade now</Button>
                </p>
              </Banner>
            )}

            {/* Error Banner */}
            {actionData?.error && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}

            {/* Product Selection */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  1. Select Product
                </Text>
                
                <InlineStack gap="300">
                  <Button onClick={() => setShowPicker(true)}>
                    {selectedProduct ? "Change Product" : "Select from Shopify"}
                  </Button>
                  <Text as="span" variant="bodySm" tone="subdued">
                    or enter details manually below
                  </Text>
                </InlineStack>

                {selectedProduct && (
                  <Card padding="300" background="bg-surface-secondary">
                    <InlineStack gap="300" align="start">
                      {selectedProduct.images?.[0] && (
                        <img 
                          src={selectedProduct.images[0].originalSrc} 
                          alt="" 
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                        />
                      )}
                      <BlockStack gap="100">
                        <Text as="span" fontWeight="semibold">
                          {selectedProduct.title}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          {selectedProduct.productType || "No type"}
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </Card>
                )}

                <TextField
                  label="Product Title"
                  value={formState.productTitle}
                  onChange={(value) => setFormState(prev => ({ ...prev, productTitle: value }))}
                  autoComplete="off"
                  placeholder="e.g., Premium Wireless Headphones"
                />

                <TextField
                  label="Product Type"
                  value={formState.productType}
                  onChange={(value) => setFormState(prev => ({ ...prev, productType: value }))}
                  autoComplete="off"
                  placeholder="e.g., Headphones, T-Shirt, Skincare"
                />

                <TextField
                  label="Current Description (optional)"
                  value={formState.existingDescription}
                  onChange={(value) => setFormState(prev => ({ ...prev, existingDescription: value }))}
                  multiline={4}
                  autoComplete="off"
                  helpText="We'll improve this description while keeping your key points"
                />

                <TextField
                  label="Key Features"
                  value={formState.features}
                  onChange={(value) => setFormState(prev => ({ ...prev, features: value }))}
                  multiline={4}
                  autoComplete="off"
                  placeholder="Enter each feature on a new line:&#10;Noise cancellation&#10;40-hour battery life&#10;Premium leather"
                  helpText="One feature per line"
                />
              </BlockStack>
            </Card>

            {/* Settings */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  2. Configure Generation
                </Text>

                <InlineStack gap="400">
                  <Box width="200px">
                    <Select
                      label="Niche"
                      options={niches.map(n => ({ label: `${n.icon} ${n.displayName}`, value: n.name }))}
                      value={formState.niche}
                      onChange={(value) => setFormState(prev => ({ ...prev, niche: value }))}
                    />
                  </Box>

                  <Box width="200px">
                    <Select
                      label="Tone"
                      options={toneOptions}
                      value={formState.tone}
                      onChange={(value) => setFormState(prev => ({ ...prev, tone: value }))}
                    />
                  </Box>

                  <Box width="200px">
                    <Select
                      label="Language"
                      options={languageOptions}
                      value={formState.language}
                      onChange={(value) => setFormState(prev => ({ ...prev, language: value }))}
                    />
                  </Box>
                </InlineStack>

                <TextField
                  label="Target Keywords (optional)"
                  value={formState.keywords}
                  onChange={(value) => setFormState(prev => ({ ...prev, keywords: value }))}
                  autoComplete="off"
                  placeholder="wireless headphones, noise canceling, premium audio"
                  helpText="Comma-separated keywords for SEO optimization"
                />
              </BlockStack>
            </Card>

            {/* Generate Button */}
            <InlineStack align="end">
              <Text as="span" variant="bodySm" tone="subdued">
                {usage.used} / {usage.limit} used this month
              </Text>
              <Button
                variant="primary"
                size="large"
                onClick={handleSubmit}
                disabled={!formState.productTitle || isGenerating || !usage.allowed}
                loading={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Description"}
              </Button>
            </InlineStack>
          </BlockStack>
        </Layout.Section>

        {/* Results Section */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Generated Result
              </Text>

              {isGenerating ? (
                <Box padding="800">
                  <BlockStack gap="400" align="center">
                    <Spinner size="large" />
                    <Text as="p" tone="subdued">
                      AI is crafting your description...
                    </Text>
                  </BlockStack>
                </Box>
              ) : actionData?.result ? (
                <BlockStack gap="400">
                  {/* SEO Score */}
                  <InlineStack align="space-between">
                    <Text as="span" fontWeight="semibold">SEO Score</Text>
                    <Tag tone={actionData.result.seoScore >= 80 ? "success" : "warning"}>
                      {actionData.result.seoScore}/100
                    </Tag>
                  </InlineStack>

                  <Divider />

                  {/* Generated Title */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Optimized Title
                    </Text>
                    <Card padding="300" background="bg-surface-secondary">
                      <Text as="p">{actionData.result.title}</Text>
                    </Card>
                  </BlockStack>

                  {/* Generated Description */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Product Description
                    </Text>
                    <Card padding="300" background="bg-surface-secondary">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: actionData.result.description 
                        }} 
                      />
                    </Card>
                  </BlockStack>

                  {/* Meta Tags */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      SEO Meta Title
                    </Text>
                    <Card padding="200" background="bg-surface-secondary">
                      <Text as="p" variant="bodySm">
                        {actionData.result.metaTitle}
                      </Text>
                    </Card>
                  </BlockStack>

                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      SEO Meta Description
                    </Text>
                    <Card padding="200" background="bg-surface-secondary">
                      <Text as="p" variant="bodySm">
                        {actionData.result.metaDescription}
                      </Text>
                    </Card>
                  </BlockStack>

                  {/* Keywords */}
                  <BlockStack gap="200">
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      Suggested Keywords
                    </Text>
                    <InlineStack gap="200">
                      {actionData.result.suggestedKeywords.map((kw: string, i: number) => (
                        <Tag key={i}>{kw}</Tag>
                      ))}
                    </InlineStack>
                  </BlockStack>

                  <Divider />

                  {/* Actions */}
                  <InlineStack gap="300">
                    {selectedProduct && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          const formData = new FormData();
                          formData.append("_action", "apply");
                          formData.append("productId", selectedProduct.id);
                          formData.append("title", actionData.result.title);
                          formData.append("description", actionData.result.description);
                          submit(formData, { method: "post" });
                        }}
                      >
                        Apply to Product
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(actionData.result.description);
                      }}
                    >
                      Copy Description
                    </Button>
                  </InlineStack>
                </BlockStack>
              ) : (
                <Text as="p" tone="subdued">
                  Configure your product details and click "Generate" to create an AI-powered description.
                </Text>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Product Picker Modal */}
      <ResourcePicker
        resourceType="Product"
        open={showPicker}
        onCancel={() => setShowPicker(false)}
        onSelection={handleProductSelect}
        showVariants={false}
        selectMultiple={false}
      />
    </Page>
  );
}
```

---

### PHASE 4: Additional Features (Days 6-7)

#### 4.1 Brand Voice Settings

```typescript
// app/routes/app.settings.tsx

import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  TextField,
  Select,
  Button,
  Banner,
  Text,
  Tag,
  InlineStack,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  
  const shop = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
    include: { brandVoice: true },
  });

  return json({ shop });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const shop = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
  });

  if (!shop) {
    return json({ error: "Shop not found" });
  }

  await prisma.brandVoice.upsert({
    where: { shopId: shop.id },
    update: {
      tone: formData.get("tone") as string,
      style: formData.get("style") as string,
      customPrompt: formData.get("customPrompt") as string,
      targetAudience: formData.get("targetAudience") as string,
      keywords: (formData.get("keywords") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      avoidWords: (formData.get("avoidWords") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      brandValues: (formData.get("brandValues") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      sampleTexts: (formData.get("sampleTexts") as string)?.split("\n---\n").filter(Boolean) || [],
    },
    create: {
      shopId: shop.id,
      tone: formData.get("tone") as string,
      style: formData.get("style") as string,
      customPrompt: formData.get("customPrompt") as string,
      targetAudience: formData.get("targetAudience") as string,
      keywords: (formData.get("keywords") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      avoidWords: (formData.get("avoidWords") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      brandValues: (formData.get("brandValues") as string)?.split(",").map(k => k.trim()).filter(Boolean) || [],
      sampleTexts: (formData.get("sampleTexts") as string)?.split("\n---\n").filter(Boolean) || [],
    },
  });

  return json({ success: true });
}

export default function SettingsPage() {
  const { shop } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const brandVoice = shop?.brandVoice;
  const isSaving = navigation.state === "submitting";

  const [formState, setFormState] = useState({
    tone: brandVoice?.tone || "professional",
    style: brandVoice?.style || "balanced",
    customPrompt: brandVoice?.customPrompt || "",
    targetAudience: brandVoice?.targetAudience || "",
    keywords: brandVoice?.keywords?.join(", ") || "",
    avoidWords: brandVoice?.avoidWords?.join(", ") || "",
    brandValues: brandVoice?.brandValues?.join(", ") || "",
    sampleTexts: brandVoice?.sampleTexts?.join("\n---\n") || "",
  });

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Brand Voice Settings"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Banner>
              <p>
                Configure your brand voice to ensure all generated descriptions 
                match your unique style and tone.
              </p>
            </Banner>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Voice & Style
                </Text>

                <Select
                  label="Default Tone"
                  options={[
                    { label: "Professional", value: "professional" },
                    { label: "Casual & Friendly", value: "casual" },
                    { label: "Luxurious & Premium", value: "luxurious" },
                    { label: "Playful & Fun", value: "playful" },
                    { label: "Technical & Detailed", value: "technical" },
                  ]}
                  value={formState.tone}
                  onChange={(value) => setFormState(prev => ({ ...prev, tone: value }))}
                />

                <Select
                  label="Writing Style"
                  options={[
                    { label: "Balanced", value: "balanced" },
                    { label: "Minimalist", value: "minimalist" },
                    { label: "Detailed & Comprehensive", value: "detailed" },
                    { label: "Storytelling", value: "storytelling" },
                    { label: "Benefit-Focused", value: "benefits" },
                  ]}
                  value={formState.style}
                  onChange={(value) => setFormState(prev => ({ ...prev, style: value }))}
                />

                <TextField
                  label="Target Audience"
                  value={formState.targetAudience}
                  onChange={(value) => setFormState(prev => ({ ...prev, targetAudience: value }))}
                  placeholder="e.g., Young professionals aged 25-35 who value quality and sustainability"
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Keywords & Vocabulary
                </Text>

                <TextField
                  label="Brand Keywords (always include)"
                  value={formState.keywords}
                  onChange={(value) => setFormState(prev => ({ ...prev, keywords: value }))}
                  placeholder="premium, handcrafted, sustainable, innovative"
                  helpText="Comma-separated words to naturally include in descriptions"
                  autoComplete="off"
                />

                <TextField
                  label="Words to Avoid"
                  value={formState.avoidWords}
                  onChange={(value) => setFormState(prev => ({ ...prev, avoidWords: value }))}
                  placeholder="cheap, basic, generic"
                  helpText="Comma-separated words that don't fit your brand"
                  autoComplete="off"
                />

                <TextField
                  label="Brand Values"
                  value={formState.brandValues}
                  onChange={(value) => setFormState(prev => ({ ...prev, brandValues: value }))}
                  placeholder="sustainability, quality, innovation, customer-first"
                  helpText="Core values to subtly weave into descriptions"
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Custom Instructions
                </Text>

                <TextField
                  label="Additional Instructions for AI"
                  value={formState.customPrompt}
                  onChange={(value) => setFormState(prev => ({ ...prev, customPrompt: value }))}
                  multiline={4}
                  placeholder="Any specific guidelines for your brand's voice..."
                  helpText="These instructions will be included in every generation"
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Sample Descriptions (for style learning)
                </Text>

                <TextField
                  label="Example Descriptions"
                  value={formState.sampleTexts}
                  onChange={(value) => setFormState(prev => ({ ...prev, sampleTexts: value }))}
                  multiline={8}
                  placeholder="Paste 2-3 of your best product descriptions here. Separate each with ---"
                  helpText="AI will learn from these examples to match your style"
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
              >
                Save Settings
              </Button>
            </InlineStack>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
```

---

### PHASE 5: Deployment (Day 8)

#### 5.1 Vercel Deployment

```bash
# 1. Ensure you're logged in
vercel login

# 2. Link project (if not already)
vercel link

# 3. Run database migrations (one-time setup)
# Option A: Locally with direct connection
npx prisma migrate deploy

# Option B: Or push schema directly
npx prisma db push

# 4. Deploy to production
vercel --prod

# 5. Get your production URL
# Example: https://describely.app (after custom domain setup)
# Or: https://describely-xxx.vercel.app
```

#### 5.2 Vercel Environment Variables (via Dashboard)

Йди в **Vercel Dashboard → Project → Settings → Environment Variables**

| Variable | Value | Environment |
|----------|-------|-------------|
| `SHOPIFY_API_KEY` | your_key | Production, Preview, Development |
| `SHOPIFY_API_SECRET` | your_secret | Production, Preview, Development |
| `SCOPES` | read_products,write_products | All |
| `HOST` | https://describely.app | Production |
| `DATABASE_URL` | postgresql://...pooler... | All |
| `DIRECT_URL` | postgresql://...direct... | All |
| `ANTHROPIC_API_KEY` | sk-ant-... | All |

#### 5.3 Update Shopify App URLs

В **Shopify Partners Dashboard → Apps → Your App → Configuration:**

```
App URL: https://describely.app/app
Allowed redirection URL(s):
  - https://describely.app/auth/callback
  - https://describely.app/auth/shopify/callback
  - https://describely.app/api/auth/callback
```

#### 5.4 Automatic Deployments

Vercel автоматично деплоїть при push в GitHub:

```bash
# Connect to GitHub
vercel git connect

# Now every push to main = production deploy
# Every PR = preview deploy
```

#### 5.5 Monitoring & Logs

```bash
# View logs
vercel logs

# View logs in real-time
vercel logs --follow

# Or use Vercel Dashboard → Deployments → Functions tab
```

#### 5.6 Custom Domain Setup (describely.app)

```bash
# Add custom domain
vercel domains add describely.app
vercel domains add www.describely.app

# Or via Dashboard: Settings → Domains
```

**DNS Configuration (у твого реєстратора):**
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

#### 5.2 Shopify App Store Submission Checklist

```markdown
## Pre-submission Checklist

### App Functionality
- [ ] All features work on mobile admin
- [ ] Error handling for API failures
- [ ] Loading states for all async operations
- [ ] Usage limits enforced correctly
- [ ] Billing integration works

### Security
- [ ] No sensitive data in client-side code
- [ ] API keys in environment variables
- [ ] Input validation on all endpoints
- [ ] CSRF protection enabled

### UX Requirements
- [ ] App follows Polaris design guidelines
- [ ] Responsive design
- [ ] Clear error messages
- [ ] Onboarding flow for new users

### App Listing
- [ ] App name: **Describely**
- [ ] Tagline (max 80 chars): "AI-powered product descriptions that match your brand voice"
- [ ] Description (min 100 words)
- [ ] Screenshots (1280x800 or 800x600)
- [ ] App icon (1200x1200)
- [ ] Demo video (optional but recommended)
- [ ] Pricing plans configured
- [ ] Support email: support@describely.app
- [ ] Privacy policy URL: https://describely.app/privacy
- [ ] FAQ/Help documentation: https://describely.app/help
```

---

## 📋 CLAUDE CODE COMMANDS SUMMARY

### Quick Reference for Claude Code:

```
# Project Setup
@workspace Create a new Shopify app with Remix template called "describely"

# Database
@workspace Set up Prisma with Neon PostgreSQL serverless and create the schema for shops, generations, and brand voices

# Neon Connection
@workspace Create the db.server.ts file with Prisma + Neon serverless adapter

# Backend Services  
@workspace Create the Claude AI service for generating product descriptions with niche-specific prompts

# Frontend Pages
@workspace Build the dashboard page with usage stats and quick actions using Polaris components

@workspace Create the generate page with product selector, niche/tone options, and result display

@workspace Build the settings page for brand voice configuration

# API Routes
@workspace Create the API endpoint for description generation with usage tracking

# Billing
@workspace Implement Shopify billing integration with FREE, STARTER, PRO, UNLIMITED plans

# Deployment
@workspace Configure vercel.json for Remix deployment with Prisma and custom domain describely.app
```

---

## 💰 COST BREAKDOWN (Vercel + Neon)

### Free Tier Limits:

| Service | Free Tier | Enough for |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth, 100 hrs compute | ~10,000 requests/day |
| **Neon** | 0.5 GB storage, 191 hrs compute | ~50,000 generations history |
| **Claude API** | Pay as you go | ~$0.003 per description |

### Estimated Monthly Costs at Scale:

| Users | Generations | Vercel | Neon | Claude | Total |
|-------|-------------|--------|------|--------|-------|
| 100 | 1,000 | $0 | $0 | $3 | **$3** |
| 500 | 5,000 | $0 | $0 | $15 | **$15** |
| 1,000 | 15,000 | $20 | $19 | $45 | **$84** |
| 5,000 | 100,000 | $20 | $69 | $300 | **$389** |

> 💡 При 1,000 платних юзерів ($29/міс avg) = **$29,000 MRR** при витратах **$84** = 99.7% margin!

---

## 🎯 SUCCESS METRICS

### Week 1 Goals:
- [ ] MVP deployed and functional
- [ ] 10 test generations successful
- [ ] App submitted to Shopify review

### Month 1 Goals:
- [ ] 100+ installs
- [ ] 10+ positive reviews
- [ ] $500+ MRR

### Month 3 Goals:
- [ ] 500+ installs
- [ ] 50+ reviews (4.8+ rating)
- [ ] $2,000+ MRR

---

*Цей план готовий для використання з Claude Code. Копіюй секції по черзі і проси Claude Code імплементувати кожну частину.*

---

## 📞 QUICK LINKS

| Resource | URL |
|----------|-----|
| **Production** | https://describely.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Neon Dashboard** | https://console.neon.tech |
| **Shopify Partners** | https://partners.shopify.com |
| **Claude API** | https://console.anthropic.com |
| **Polaris Docs** | https://polaris.shopify.com |
| **Remix Docs** | https://remix.run/docs |
