# Describely — Контекст проекту для Claude Code

## Що це за проект

**Describely** — Shopify App для AI-генерації описів товарів з SEO-оптимізацією.
Домен: `describely.app`

Користувач обирає товар зі свого Shopify-магазину (або вводить вручну), вибирає нішу, тон та мову — і отримує готовий опис з SEO meta-тегами, оцінкою SEO та рекомендованими ключовими словами. Опис можна одразу застосувати до товару в Shopify.

---

## Технологічний стек

| Компонент | Технологія | Версія |
|-----------|-----------|--------|
| Frontend | React + Shopify Polaris | React 18, Polaris 13 |
| Backend | Remix (Vite) | Remix 2.15 |
| База даних | Neon PostgreSQL (serverless) | через Prisma 5.22 |
| AI | Claude API (Anthropic SDK) | claude-sonnet-4 |
| Хостинг | Vercel (serverless) | region: fra1 |
| Платежі | Shopify Billing API | 4 плани |
| Валідація | Zod | 3.24 |
| Auth | @shopify/shopify-app-remix | OAuth + Session Storage |

---

## Поточна структура проекту

```
D:\Myapps\describely\
├── app/
│   ├── routes/
│   │   ├── app.tsx                    ✅ Layout з навігацією (Polaris + NavMenu)
│   │   ├── app._index.tsx             ✅ Dashboard: usage, stats, quick actions, recent generations
│   │   ├── app.generate.tsx           ✅ Генерація: product input, niche/tone/language, result display, apply/copy
│   │   ├── app.bulk.tsx               ✅ Bulk: textarea input (Title|Type|Features), batch processing, results
│   │   ├── app.settings.tsx           ✅ Brand voice: tone, style, keywords, avoid words, custom prompt, samples
│   │   ├── app.history.tsx            ✅ Історія: фільтр по ніші, пагінація, copy, preview
│   │   ├── app.billing.tsx            ✅ 4 плани (grid), upgrade/downgrade, FAQ
│   │   ├── app.billing.confirm.tsx    ✅ Підтвердження Shopify billing redirect
│   │   ├── api.generate.tsx           ✅ POST JSON API для генерації (standalone endpoint)
│   │   ├── api.bulk-generate.tsx      ✅ POST JSON API для bulk (batch по 3, rate limiting)
│   │   ├── api.analyze-voice.tsx      ✅ POST API: аналіз sample texts → brand voice profile
│   │   ├── auth.$.tsx                 ✅ Shopify OAuth catch-all
│   │   ├── auth.login/route.tsx       ✅ Сторінка логіну
│   │   └── webhooks.tsx               ✅ Shopify webhooks (APP_UNINSTALLED, compliance)
│   │
│   ├── components/
│   │   ├── UsageCounter.tsx           ✅ Usage progress bar з планом badge (compact mode)
│   │   ├── SeoScoreBadge.tsx          ✅ Колірний badge SEO score (green/yellow/red)
│   │   ├── NicheSelector.tsx          ✅ Select з іконками 9 ніш
│   │   ├── ToneSelector.tsx           ✅ Select 6 тонів
│   │   └── GenerationCard.tsx         ✅ Повна картка результату: title, description, meta, keywords, actions
│   │
│   ├── services/
│   │   ├── claude.server.ts           ✅ Claude API: generateProductDescription(), generateBulkDescriptions()
│   │   ├── prompts.server.ts          ✅ 9 ніш: NICHE_CONFIGS, getPromptForNiche(), getAllNiches()
│   │   └── billing.server.ts          ✅ PLAN_LIMITS/PRICES/FEATURES, checkUsageLimit(), incrementUsage(), createSubscription(), cancelSubscription()
│   │
│   ├── models/
│   │   ├── shop.server.ts             ✅ getShop(), getOrCreateShop(), updateShopSettings(), updateShopPlan()
│   │   ├── generation.server.ts       ✅ createGeneration(), getGenerationsByShop(), getGenerationStats(), markGenerationApplied()
│   │   ├── brandVoice.server.ts       ✅ getBrandVoice(), upsertBrandVoice()
│   │   └── template.server.ts         ✅ getNicheTemplate(), getAllNicheTemplates(), seedNicheTemplates()
│   │
│   ├── utils/
│   │   ├── validation.ts              ✅ Zod-схеми: generateDescriptionSchema, brandVoiceSchema, parseFormData()
│   │   └── seo.ts                     ✅ calculateSeoScore(), stripHtml(), wordCount(), truncateForMeta()
│   │
│   ├── db.server.ts                   ✅ Prisma Client з Neon serverless адаптером (ws)
│   ├── env.d.ts                       ✅ TypeScript declarations для CSS ?url imports
│   ├── entry.server.tsx               ✅ Remix server entry з Shopify headers
│   ├── root.tsx                       ✅ Root layout (HTML shell, Shopify fonts)
│   └── shopify.server.ts             ✅ Shopify auth config (API v2024-10, Prisma session storage)
│
├── prisma/
│   └── schema.prisma                  ✅ 5 моделей: Session, Shop, BrandVoice, Generation, NicheTemplate
│                                         2 enum: Plan (FREE/STARTER/PRO/UNLIMITED), GenerationStatus
│
├── public/                            (статичні файли)
├── інструкції, дизайн, лого, файли/   📋 Дизайн-макети та повний план реалізації
│   ├── describely_implementation_plan.md   ← Детальний план (70+ КБ)
│   ├── Describely logo.png
│   └── Gemini_Generated_Image_*.png   ← UI мокапи (dashboard, generate, mobile)
│
├── node_modules/                      ✅ Встановлені
├── package.json                       ✅
├── tsconfig.json                      ✅
├── vite.config.ts                     ✅ Remix + Vite, HMR config
├── shopify.app.toml                   ✅ scopes: read_products, write_products
├── vercel.json                        ✅ region: fra1, build command з prisma generate
├── .env                               ✅ Шаблон (потребує реальних ключів)
├── .gitignore                         ✅
└── CLAUDE.md                          ← Цей файл
```

**TypeScript: 0 помилок** (перевірено `npx tsc --noEmit`)

---

## Статус по фазах

### Фаза 1: Project Setup ✅
- Структура проекту створена вручну (без Shopify CLI — потрібна інтерактивна авторизація)
- Vite + Remix + TypeScript
- Prisma schema з 5 моделями + Neon serverless адаптер
- Shopify auth через @shopify/shopify-app-remix
- Базові маршрути: app layout, auth, webhooks
- npm-залежності встановлені

### Фаза 2: Backend Services ✅
- Claude AI сервіс: single + bulk генерація, system/user prompt builder, JSON parsing з fallback
- 9 ніш: кожна з власним system prompt, keyword patterns, structure guide
- Billing: 4 плани, місячний ресет лічильника, Shopify Billing API integration
- Моделі: CRUD для shops, generations, brand voice, niche templates
- Утиліти: Zod валідація форм, SEO scoring (0-100)

### Фаза 3: Frontend Pages ✅
- **Dashboard** — usage card (progress bar), stats (total, avg SEO, applied), quick actions, recent 5 generations
- **Generate** — product input form, niche/tone/language selectors, brand voice indicator, result display з SEO score, copy/apply actions
- **Bulk Generate** — multi-line textarea (Title|Type|Features format), shared settings, batch results display
- **Settings** — brand voice config: tone, style, target audience, keywords, avoid words, brand values, custom prompt, sample texts
- **History** — filterable by niche, paginated (10/page), expandable cards з description preview, copy actions
- **Billing** — 4-column plan grid з features list, current plan highlight, upgrade/downgrade/cancel, FAQ section
- **Components** — UsageCounter, SeoScoreBadge, NicheSelector, ToneSelector, GenerationCard

### Фаза 4: API Routes ✅
- `POST /api/generate` — standalone JSON API з usage tracking
- `POST /api/bulk-generate` — batch processing (3 concurrent), rate limiting
- `POST /api/analyze-voice` — Claude-powered brand voice analysis з auto-save

### Фаза 5: Deployment & Integration ❌ (наступний крок)
Потрібно зробити:
1. **Shopify Partners підключення**: `shopify app config link` (інтерактивна команда — запускати в терміналі користувача)
2. **Neon Database**: створити БД на neon.tech, скопіювати connection strings
3. **Заповнити .env реальними ключами**:
   - `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` (з Shopify Partners)
   - `DATABASE_URL` / `DIRECT_URL` (з Neon dashboard)
   - `ANTHROPIC_API_KEY` (з console.anthropic.com)
4. **Prisma push**: `npx prisma db push` — створити таблиці
5. **Seed niche templates**: викликати `seedNicheTemplates()` з `models/template.server.ts`
6. **Vercel deploy**: `npx vercel --prod`
7. **Custom domain**: налаштувати describely.app → Vercel
8. **Тестування**: embedded app в Shopify Admin
9. **App Store submission**: screenshots, description, privacy policy

---

## Важливі деталі

### Shopify Polaris Imports
```typescript
import {
  Page, Layout, Card, BlockStack, InlineStack, Text,
  TextField, Select, Button, Banner, ProgressBar, Badge,
  Spinner, Box, Divider, Tag, Pagination, EmptyState,
  InlineGrid
} from "@shopify/polaris";
```

### Remix Patterns
- `loader` — серверний GET (authenticate.admin → fetch data)
- `action` — серверний POST (formData або json → process → json response)
- `useLoaderData`, `useActionData` (cast as `any` для union types), `useSubmit`, `useNavigation`
- Navigation state: `navigation.state === "submitting"` для loading
- `useSearchParams` для фільтрів та пагінації

### Shopify Auth Pattern
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  // session.shop = "store-name.myshopify.com"
  // session.accessToken = OAuth token
  // admin = Shopify GraphQL client
}
```

### TypeScript Notes
- `useActionData` повертає union type → використовуємо `as any` cast
- Polaris `Badge` children повинен бути string → template literals `{`SEO: ${score}`}`
- Polaris `ProgressBar` tone: тільки `"primary" | "success" | "critical"` (не "warning")
- CSS imports з `?url` потребують `env.d.ts` declaration

### Плани та ліміти
| Plan | Price | Generations/month |
|------|-------|-------------------|
| FREE | $0 | 10 |
| STARTER | $19 | 100 |
| PRO | $49 | 500 |
| UNLIMITED | $99 | 999999 |

### 9 ніш
fashion, electronics, beauty, food, home, sports, jewelry, pets, general

### Тони
professional, casual, luxurious, playful, technical, minimalist

### Мови
en, uk, de, fr, es

### Bulk Format (textarea input)
```
Product Title | Product Type | Feature1, Feature2, Feature3
```

---

## Як продовжити роботу

1. Прочитай цей файл для контексту
2. Фази 1-4 повністю завершені, TypeScript чистий (0 помилок)
3. Наступний крок — Фаза 5: Deployment (потребує дій від користувача: Shopify Partners, Neon, Anthropic ключі)
4. Подивись мокапи в `інструкції, дизайн, лого, файли/` для візуального дизайну
5. Детальний план є в `інструкції, дизайн, лого, файли/describely_implementation_plan.md`
