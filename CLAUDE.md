# InkBot — Контекст проекту для Claude Code

## Що це за проект

**InkBot — AI Product Descriptions & SEO** — Shopify App для AI-генерації описів товарів з SEO-оптимізацією.
Vercel URL: `https://inkbotapp.vercel.app`
GitHub: `https://github.com/volodeveth/inkbot` (private)

Користувач обирає товар зі свого Shopify-магазину (або вводить вручну), вибирає нішу, тон та мову — і отримує готовий опис з SEO meta-тегами, оцінкою SEO та рекомендованими ключовими словами. Опис можна одразу застосувати до товару в Shopify.

---

## Технологічний стек

| Компонент | Технологія | Версія |
|-----------|-----------|--------|
| Frontend | React + Shopify Polaris | React 18, Polaris 13 |
| Backend | Remix (Vite) | Remix 2.15 |
| База даних | Neon PostgreSQL (serverless) | через Prisma 5.22 |
| AI | DeepSeek V3 (via OpenRouter) | deepseek/deepseek-chat-v3-0324 |
| Хостинг | Vercel (serverless) | region: fra1 |
| Платежі | Shopify Billing API | 4 плани |
| Валідація | Zod | 3.24 |
| Email | Resend API (via fetch) | Free tier, onboarding@resend.dev sender |
| Auth | @shopify/shopify-app-remix | OAuth + Session Storage + API Keys (dsc_ prefix) |

---

## Поточна структура проекту

```
D:\Myapps\describely\
├── app/
│   ├── routes/
│   │   ├── _index.tsx                   ✅ Root redirect → /landing (або /app з ?shop=)
│   │   ├── app.tsx                    ✅ Layout з навігацією (Polaris + NavMenu), глобальний футер "Built by VoloDev.eth"
│   │   ├── app._index.tsx             ✅ Dashboard: logo, tagline, usage, stats, quick actions, recent generations, review banner
│   │   ├── app.generate.tsx           ✅ Генерація: product input, niche/tone/language, result display, apply/copy, review banner
│   │   ├── app.bulk.tsx               ✅ Bulk: textarea input (Title|Type|Features), batch processing, results, review banner
│   │   ├── app.settings.tsx           ✅ Brand voice: tone, style, keywords, avoid words, custom prompt, samples
│   │   ├── app.history.tsx            ✅ Історія: фільтр по ніші, пагінація, copy, preview
│   │   ├── app.billing.tsx            ✅ 4 плани (grid), upgrade/downgrade, FAQ
│   │   ├── app.billing.confirm.tsx    ✅ Підтвердження Shopify billing redirect
│   │   ├── app.api-docs.tsx            ✅ API docs: key management (generate/regenerate/revoke), auth docs, curl examples, endpoints reference
│   │   ├── app.support.tsx            ✅ Support: contact form (shop/plan auto-fill, email/subject/description), Resend API, auto ticket numbers (#123150+)
│   │   ├── api.generate.tsx           ✅ POST JSON API для генерації (Bearer API key + session auth, CORS)
│   │   ├── api.bulk-generate.tsx      ✅ POST JSON API для bulk (Bearer API key + session auth, CORS, batch по 3)
│   │   ├── api.analyze-voice.tsx      ✅ POST API: аналіз sample texts → brand voice profile
│   │   ├── auth.$.tsx                 ✅ Shopify OAuth catch-all
│   │   ├── auth.login/route.tsx       ✅ Сторінка логіну
│   │   ├── webhooks.tsx               ✅ Shopify webhooks (APP_UNINSTALLED, compliance)
│   │   ├── landing.tsx                ✅ Публічна landing page (dark theme, hover effects, SEO)
│   │   ├── privacy.tsx                ✅ Privacy Policy (dark theme, matching landing)
│   │   └── terms.tsx                  ✅ Terms of Service (dark theme, matching landing)
│   │
│   ├── components/
│   │   ├── UsageCounter.tsx           ✅ Usage progress bar з планом badge (compact mode)
│   │   ├── SeoScoreBadge.tsx          ✅ Колірний badge SEO score (green/yellow/red)
│   │   ├── NicheSelector.tsx          ✅ Select з іконками 9 ніш
│   │   ├── ToneSelector.tsx           ✅ Select 6 тонів
│   │   └── GenerationCard.tsx         ✅ Повна картка результату: title, description, meta, keywords, actions
│   │
│   ├── services/
│   │   ├── ai.server.ts               ✅ DeepSeek API (via OpenRouter): generateProductDescription(), generateBulkDescriptions(), LANGUAGE_NAMES (42 мови)
│   │   ├── prompts.server.ts          ✅ 9 ніш: NICHE_CONFIGS, getPromptForNiche(), getAllNiches()
│   │   ├── billing.server.ts          ✅ checkUsageLimit(), incrementUsage(), createSubscription(), cancelSubscription() + auto-revoke API keys on downgrade
│   │   ├── apiKey.server.ts           ✅ generateApiKey() (dsc_ prefix, 128-bit), hashApiKey() (SHA-256), isValidApiKeyFormat()
│   │   └── apiAuth.server.ts          ✅ authenticateApiRequest(): Bearer API key auth → fallback to Shopify session auth
│   │
│   ├── models/
│   │   ├── shop.server.ts             ✅ getShop(), getOrCreateShop(), updateShopSettings(), updateShopPlan(), getShopByApiKeyHash(), setShopApiKey(), revokeShopApiKey(), markReviewLeft()
│   │   ├── generation.server.ts       ✅ createGeneration(), getGenerationsByShop(), getGenerationStats(), markGenerationApplied()
│   │   ├── brandVoice.server.ts       ✅ getBrandVoice(), upsertBrandVoice()
│   │   └── template.server.ts         ✅ getNicheTemplate(), getAllNicheTemplates(), seedNicheTemplates()
│   │
│   ├── utils/
│   │   ├── plans.ts                   ✅ PLAN_LIMITS, PLAN_PRICES, PLAN_FEATURES (shared client+server)
│   │   ├── validation.ts              ✅ Zod-схеми: generateDescriptionSchema, brandVoiceSchema, parseFormData()
│   │   └── seo.ts                     ✅ calculateSeoScore(), stripHtml(), wordCount(), truncateForMeta()
│   │
│   ├── db.server.ts                   ✅ Prisma Client з Neon serverless адаптером (ws)
│   ├── env.d.ts                       ✅ TypeScript declarations для CSS ?url imports
│   ├── entry.server.tsx               ✅ Remix server entry з Shopify headers
│   ├── root.tsx                       ✅ Root layout (HTML shell, Shopify fonts, favicon)
│   └── shopify.server.ts             ✅ Shopify auth config (API v2024-10, Prisma session storage)
│
├── prisma/
│   └── schema.prisma                  ✅ 6 моделей: Session, Shop (+ apiKeyHash, apiKeyPrefix, apiKeyCreatedAt, reviewLeft), BrandVoice, Generation, NicheTemplate, SupportTicket (autoincrement ID)
│                                         2 enum: Plan (FREE/STARTER/PRO/UNLIMITED), GenerationStatus
│
├── public/
│   ├── favicon.png                    ✅ InkBot small logo (1200×1200) — favicon
│   ├── logo.png                       ✅ InkBot Big Logo (881×427)
│   └── logo-big.png                   ✅ InkBot Big Logo (881×427) — для landing
├── інструкції, дизайн, лого, файли/   📋 Дизайн-макети та повний план реалізації
│   ├── describely_implementation_plan.md   ← Детальний план (70+ КБ, стара назва)
│   ├── Публікація InkBot в Shopify App Store.txt  ✅ Чекліст публікації
│   ├── App Store Listing.md           ✅ Tagline, description, screenshot guide
│   ├── InkBot Big Logo.png            ✅ 881×427 — для dashboard
│   ├── InkBot small logo.png          ✅ 1200×1200 — для Shopify Partners app icon
│   └── Gemini_Generated_Image_*.png   ← UI мокапи (dashboard, generate, mobile)
│
├── node_modules/                      ✅ Встановлені
├── package.json                       ✅
├── tsconfig.json                      ✅
├── vite.config.ts                     ✅ Remix + Vite, HMR config
├── shopify.app.toml                   ✅ scopes: read_products, write_products
├── vercel.json                        ✅ region: fra1, build command з npx prisma generate
├── .env                               ✅ Реальні ключі налаштовані (локально)
├── .gitignore                         ✅
└── CLAUDE.md                          ← Цей файл
```

**TypeScript: 0 помилок** (перевірено `npx tsc --noEmit`)
**Build: ✅** (client + server bundles збираються успішно)

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
- DeepSeek AI сервіс (via OpenRouter): single + bulk генерація, system/user prompt builder, JSON mode, fallback parsing
- 9 ніш: кожна з власним system prompt, keyword patterns, structure guide
- Billing: 4 плани, місячний ресет лічильника, Shopify Billing API integration
- Моделі: CRUD для shops, generations, brand voice, niche templates
- Утиліти: Zod валідація форм, SEO scoring (0-100)

### Фаза 3: Frontend Pages ✅
- **Dashboard** — logo, tagline ("Stop writing. Start selling. AI-generated descriptions & SEO in seconds."), usage card (progress bar), stats (total, avg SEO, applied), quick actions, recent 5 generations, review banner
- **Generate** — product input form, niche/tone/language (42 мови) selectors, brand voice indicator, result display з SEO score, copy/apply actions, review banner
- **Bulk Generate** — multi-line textarea (Title|Type|Features format), shared settings, batch results display, review banner
- **Settings** — brand voice config: tone, style, target audience, keywords, avoid words, brand values, custom prompt, sample texts
- **History** — filterable by niche, paginated (10/page), expandable cards з description preview, copy actions
- **Billing** — 4-column plan grid з features list, current plan highlight, upgrade/downgrade/cancel, FAQ section
- **Support** — contact form з auto-fill (shop, plan), email/subject/description, Resend API відправка, автоматичні номери тікетів (#123150+)
- **Components** — UsageCounter, SeoScoreBadge, NicheSelector, ToneSelector, GenerationCard
- **Footer** — глобальний футер "Built by VoloDev.eth" (onClick window.open для обходу Shopify iframe CSP)

### Фаза 4: API Routes ✅
- `POST /api/generate` — standalone JSON API з usage tracking, Bearer API key + session auth, CORS headers
- `POST /api/bulk-generate` — batch processing (3 concurrent), rate limiting, Bearer API key + session auth, CORS headers
- `POST /api/analyze-voice` — Claude-powered brand voice analysis з auto-save
- **API Key Authentication** — `dsc_`-prefixed keys (128-bit random, SHA-256 hashed), UNLIMITED plan only, auto-revoke on downgrade
- **API Docs page** (`app.api-docs.tsx`) — key management UI (generate/regenerate/revoke), Bearer auth docs, curl examples, endpoint reference

### Фаза 5: Deployment & Integration ✅ (частково)
**Зроблено:**
- ✅ GitHub repo створено (private): `https://github.com/volodeveth/inkbot`
- ✅ Vercel deployment працює: `https://inkbotapp.vercel.app`
- ✅ Neon PostgreSQL database створена, таблиці синхронізовані (`prisma db push`)
- ✅ Shopify Partners app створено (назва: `inkbot`)
- ✅ App URLs налаштовані (redirect URLs, app URL → Vercel)
- ✅ Environment variables налаштовані в Vercel (SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_APP_URL, DATABASE_URL, DIRECT_URL, SCOPES, OPENROUTER_API_KEY, RESEND_API_KEY)
- ✅ Dev store створено і додаток встановлено — працює!

**Потрібно зробити:**
1. **Тестування в dev store**: перевірити генерацію описів, bulk, settings, billing flow
2. **Додати OPENROUTER_API_KEY** з реальним ключем в Vercel (якщо ще не додано)
3. **Seed niche templates**: викликати `seedNicheTemplates()` з `models/template.server.ts`
4. **Custom domain**: налаштувати inkbot.app → Vercel (опціонально)
5. **UI polish**: перевірити відповідність мокапам з папки інструкцій
6. **App Store submission**: screenshots (3-5 шт, 1600×900)

**Готово для App Store:**
- ✅ Privacy Policy (`/privacy`) — dark theme, matching landing
- ✅ Terms of Service (`/terms`) — dark theme, matching landing
- ✅ Landing Page (`/landing`) — public marketing page з SEO, hover effects
- ✅ Favicon (`/favicon.png`) — InkBot small logo 1200×1200
- ✅ Tagline (98 символів) — див. `App Store Listing.md`
- ✅ Full Description — див. `App Store Listing.md`
- ✅ Категорії: Store design → Product descriptions, Marketing → SEO

---

## Вирішені проблеми (для контексту)

### Build помилки на Vercel
- `prisma: command not found` → додано `npx` prefix до всіх prisma/remix команд в package.json та vercel.json
- `Server-only module referenced by client` → план-константи (PLAN_LIMITS/PRICES/FEATURES) винесені з `billing.server.ts` у `utils/plans.ts` (без `.server` суфіксу)
- `ShopifyError: Detected an empty appUrl` → потрібно додати env vars у Vercel + redeploy після змін

### TypeScript помилки (всі вирішені)
- Badge children type → template literals замість JSX масивів
- ProgressBar tone → тільки `"primary" | "success" | "critical"`
- useActionData union type → cast `as any`
- CSS `?url` imports → `env.d.ts` declaration
- LoginErrorType → `type LoginError` import

### Shopify iframe CSP
- Зовнішні посилання (`<a href="...">`) блокуються CSP в Shopify iframe → використовуємо `onClick + window.open()` замість `href`
- Review banner: deep link `https://admin.shopify.com/store/STORE/oauth/install?client_id=APP_ID` → відкриває Shopify review modal напряму
- Footer: `href="#" onClick={(e) => { e.preventDefault(); window.open(url, "_blank"); }}`

### Prisma
- Prisma v5.22 (не v6!) через peer dependency від `@shopify/shopify-app-session-storage-prisma`
- `previewFeatures = ["driverAdapters"]` для Neon serverless
- Потрібні обидва: `DATABASE_URL` (pooler) та `DIRECT_URL` (direct) для Neon

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
- **ВАЖЛИВО**: `.server.ts` модулі НЕ можна імпортувати в component code (тільки в loader/action). Для shared констант використовуй файли без `.server` суфікса (як `utils/plans.ts`).

### Shopify Auth Pattern
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);
  // session.shop = "store-name.myshopify.com"
  // session.accessToken = OAuth token
  // admin = Shopify GraphQL client
}
```

### API Key Auth Pattern (for api.generate / api.bulk-generate)
```typescript
import { authenticateApiRequest } from "~/services/apiAuth.server";

export async function action({ request }: ActionFunctionArgs) {
  // Checks Bearer dsc_... header first → falls back to Shopify session auth
  const { shopDomain, authMethod } = await authenticateApiRequest(request);
  // authMethod: "api_key" | "session"
}
```
- Keys: `dsc_` + 32 hex chars (128-bit random), SHA-256 hashed in DB (`apiKeyHash` @unique on Shop)
- Only UNLIMITED plan can create/use API keys
- Keys auto-revoked when plan downgraded (cancelSubscription / createSubscription FREE)
- CORS headers (`Access-Control-Allow-Origin: *`) + OPTIONS preflight on both API routes

### TypeScript Notes
- `useActionData` повертає union type → використовуємо `as any` cast
- Polaris `Badge` children повинен бути string → template literals `{`SEO: ${score}`}`
- Polaris `ProgressBar` tone: тільки `"primary" | "success" | "critical"` (не "warning")
- CSS imports з `?url` потребують `env.d.ts` declaration

### Плани та ліміти
| Plan | Price | Generations/month |
|------|-------|-------------------|
| FREE | $0 | 5 |
| STARTER | $9 | 100 |
| PRO | $19 | 500 |
| ELITE (key: UNLIMITED) | $49 | 5000 |

### 9 ніш
fashion, electronics, beauty, food, home, sports, jewelry, pets, general

### Тони
professional, casual, luxurious, playful, technical, minimalist

### Мови (42 мови)

**Основні світові:**
en (English), es (Spanish), fr (French), de (German), it (Italian), pt (Portuguese), zh (Chinese), ja (Japanese), ko (Korean)

**Європейський регіон:**
uk (Ukrainian), pl (Polish), nl (Dutch), sv (Swedish), da (Danish), no (Norwegian), fi (Finnish), cs (Czech), hu (Hungarian), ro (Romanian), el (Greek), tr (Turkish)

**Азійський та Близькосхідний регіон:**
ar (Arabic), hi (Hindi), th (Thai), vi (Vietnamese), id (Indonesian), ms (Malay), bn (Bengali), he (Hebrew), tl (Filipino)

**Африканський регіон:**
fr-af (French African), ar-na (Arabic North African), sw (Swahili), af (Afrikaans), am (Amharic), yo (Yoruba), zu (Zulu), xh (Xhosa), ha (Hausa), ig (Igbo), om (Oromo), sn (Shona)

Мова задається через `LANGUAGE_NAMES` map в `ai.server.ts` (код → повна назва). Порядок у селекторі: пріоритетна група (en, es, fr, de, it, pt, zh, ja, ko) першою, потім решта алфавітно. Prompt містить потрійне підсилення мовної вимоги (system prompt CRITICAL LANGUAGE REQUIREMENT + rule #8 + user prompt IMPORTANT).

### Review Banner
- Перманентний банер "Enjoying InkBot?" на Dashboard, Generate та Bulk сторінках
- Показується доки `shop.reviewLeft === false`
- Кнопка "Leave a Review" → deep link `https://admin.shopify.com/store/{store}/oauth/install?client_id={appId}` через `window.open()` + встановлює `reviewLeft = true` через action `leaveReview`
- Без кнопки dismiss — тільки "Leave a Review"
- Поле `reviewLeft Boolean @default(false)` на моделі Shop
- Функція `markReviewLeft(shopDomain)` в `shop.server.ts`

### Support Page (`app.support.tsx`)
- Контактна форма з полями: Shop (disabled, auto-fill), Plan (disabled, auto-fill), Email, Subject, Description
- Відправка через Resend API (`fetch`, без npm пакету): `from: "InkBot <onboarding@resend.dev>"`, `to: "starbowshine@gmail.com"`, `reply_to: email користувача`
- **Автоматичні номери тікетів**: модель `SupportTicket` (autoincrement ID), номер = `123149 + id` (починаючи з `#123150`)
- Номер тікету показується в success банері та включається в email subject: `[InkBot Support #123150] Subject`
- Env: потрібен `RESEND_API_KEY` (Resend free tier: 100 emails/day, 3000/month)

### Sidebar Menu (порядок)
1. Dashboard
2. Generate
3. Bulk Generate
4. History
5. API
6. Settings
7. Billing
8. Support

### Footer
- Глобальний футер в `app.tsx` під `<Outlet />`
- "Built by VoloDev.eth • Privacy • Terms"
- Посилання: VoloDev.eth → `https://volodeveth.vercel.app/`, Privacy → `/privacy`, Terms → `/terms`
- Використовує `onClick + window.open()` замість `href` для обходу Shopify iframe CSP

### Public Pages (без Shopify auth)
- `/landing` — Landing page (dark theme, hero, features, pricing, CTA, hover effects, SEO meta tags)
- `/privacy` — Privacy Policy (dark theme, matching landing)
- `/terms` — Terms of Service (dark theme, matching landing)
- Доступні публічно: `https://inkbotapp.vercel.app/landing`, `/privacy`, `/terms`
- **Landing features**:
  - Navigation з hover effects (animated underline)
  - Hero section з Shopify badge та CTA buttons
  - Features grid (6 feature cards з hover effects)
  - "How it Works" section (3 steps)
  - Pricing grid (4 plans, matching billing page)
  - Final CTA section
  - Footer з links
- **Styling**: Dark theme (#0a0a0f base), purple/violet gradients (#8b5cf6, #6d28d9), glassmorphism, CSS animations
- **SEO**: Open Graph, Twitter Cards meta tags для Google indexing

### Bulk Format (textarea input)
```
Product Title | Product Type | Feature1, Feature2, Feature3
```

---

## Як продовжити роботу

1. Прочитай цей файл для контексту
2. Фази 1-4 повністю завершені, TypeScript чистий (0 помилок), build працює
3. Deployment працює: Vercel + Neon + Shopify Partners
4. Додаток встановлено на dev store
5. **App Store preparation**: Privacy Policy, Terms of Service, Tagline, Description — готові
6. **Наступні кроки**: зробити screenshots (1600×900), тестування, submit to App Store
7. Подивись мокапи в `інструкції, дизайн, лого, файли/` для візуального дизайну
8. App Store listing матеріали: `інструкції, дизайн, лого, файли/App Store Listing.md`
9. Чекліст публікації: `інструкції, дизайн, лого, файли/Публікація InkBot в Shopify App Store.txt`
