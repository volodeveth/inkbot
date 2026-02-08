# InkBot — Контекст проекту для Claude Code

## Що це за проект

**InkBot — AI Product Descriptions & SEO** — Shopify App для AI-генерації описів товарів з SEO-оптимізацією.
Production URL: `https://inkbot.app`
Vercel URL: `https://inkbotapp.vercel.app` (альтернативний)
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
D:\Myapps\InkBot\
├── app/
│   ├── routes/
│   │   ├── _index.tsx                   ✅ Root redirect → /landing (або /app з ?shop=)
│   │   ├── app.tsx                    ✅ Layout з навігацією (Polaris + NavMenu), глобальний футер "Built by VoloDev.eth"
│   │   ├── app._index.tsx             ✅ Dashboard: logo, tagline, usage, stats, quick actions, recent generations, review banner
│   │   ├── app.generate.tsx           ✅ Генерація: product input, niche/tone/language, generation options checkboxes, result display, apply/copy (with tags), review banner
│   │   ├── app.bulk.tsx               ✅ Bulk: product picker з фільтрами (collection, status, search), generation options checkboxes, batch processing, results, tags support, review banner
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
│   │   ├── guide.tsx                  ✅ Публічна tutorial page (10 steps, dark theme, Vimeo video, mock UIs + screenshots, scroll animations)
│   │   ├── privacy.tsx                ✅ Privacy Policy (dark theme, matching landing)
│   │   ├── terms.tsx                  ✅ Terms of Service (dark theme, matching landing)
│   │
│   ├── screenshots.tsx.bak            🔒 Screenshot generator (вимкнено, винесено з routes/ щоб Vite не підхоплював)
│   │
│   ├── components/
│   │   ├── UsageCounter.tsx           ✅ Usage progress bar з планом badge (compact mode)
│   │   ├── SeoScoreBadge.tsx          ✅ Колірний badge SEO score (green/yellow/red)
│   │   ├── NicheSelector.tsx          ✅ Select з іконками 9 ніш
│   │   ├── ToneSelector.tsx           ✅ Select 6 тонів
│   │   ├── GenerationCard.tsx         ✅ Повна картка результату: title, description, meta, tags, actions
│   │   └── BulkProductPicker.tsx      ✅ Product picker з фільтрами: collection, status (All/Not generated/Generated), search, "Generated" badge
│   │
│   ├── services/
│   │   ├── ai.server.ts               ✅ DeepSeek API (via OpenRouter): generateProductDescription(), generateBulkDescriptions() (imports LANGUAGE_NAMES from utils/languages)
│   │   ├── prompts.server.ts          ✅ 9 ніш: NICHE_CONFIGS, getPromptForNiche(), getAllNiches()
│   │   ├── billing.server.ts          ✅ checkUsageLimit(), incrementUsage(), createSubscription(), cancelSubscription() + auto-revoke API keys on downgrade
│   │   ├── apiKey.server.ts           ✅ generateApiKey() (dsc_ prefix, 128-bit), hashApiKey() (SHA-256), isValidApiKeyFormat()
│   │   └── apiAuth.server.ts          ✅ authenticateApiRequest(): Bearer API key auth → fallback to Shopify session auth
│   │
│   ├── models/
│   │   ├── shop.server.ts             ✅ getShop(), getOrCreateShop(), updateShopSettings(), updateShopPlan(), getShopByApiKeyHash(), setShopApiKey(), revokeShopApiKey(), markReviewLeft()
│   │   ├── generation.server.ts       ✅ createGeneration(), getGenerationsByShop(), getGenerationStats(), markGenerationApplied(), getGeneratedProductIds()
│   │   ├── brandVoice.server.ts       ✅ getBrandVoice(), upsertBrandVoice()
│   │   └── template.server.ts         ✅ getNicheTemplate(), getAllNicheTemplates(), seedNicheTemplates()
│   │
│   ├── utils/
│   │   ├── plans.ts                   ✅ PLAN_LIMITS, PLAN_PRICES, PLAN_FEATURES (shared client+server)
│   │   ├── generateOptions.ts         ✅ GenerateOptions interface, DEFAULT_GENERATE_OPTIONS (shared client+server)
│   │   ├── languages.ts               ✅ LANGUAGE_NAMES (111 мов), languageOptions (shared client+server, single source of truth)
│   │   ├── shopify.server.ts          ✅ Shopify GraphQL queries: PRODUCTS_QUERY, COLLECTIONS_QUERY, PRODUCTS_BY_COLLECTION_QUERY, parse functions
│   │   ├── validation.ts              ✅ Zod-схеми: generateDescriptionSchema (language enum from languages.ts), brandVoiceSchema, parseFormData()
│   │   └── seo.ts                     ✅ calculateSeoScore(), stripHtml(), wordCount(), truncateForMeta()
│   │
│   ├── types/
│   │   └── shopify.ts                 ✅ ShopifyProduct, ShopifyCollection, ShopifyProductsResponse interfaces
│   │
│   ├── db.server.ts                   ✅ Prisma Client з Neon serverless адаптером (ws)
│   ├── env.d.ts                       ✅ TypeScript declarations для CSS ?url imports
│   ├── entry.server.tsx               ✅ Remix server entry з Shopify headers
│   ├── root.tsx                       ✅ Root layout (HTML shell, Shopify fonts, favicon)
│   └── shopify.server.ts             ✅ Shopify auth config (API v2024-10, Prisma session storage)
│
├── prisma/
│   └── schema.prisma                  ✅ 6 моделей: Session, Shop (+ apiKeyHash, apiKeyPrefix, apiKeyCreatedAt, reviewBannerState), BrandVoice, Generation, NicheTemplate, SupportTicket (autoincrement ID)
│                                         2 enum: Plan (FREE/STARTER/PRO/UNLIMITED), GenerationStatus
│
├── public/
│   ├── favicon.png                    ✅ InkBot small logo (1200×1200) — favicon, іконка без тексту
│   ├── logo.png                       ✅ InkBot Big Logo (881×427) — іконка + текст (темний)
│   ├── logo-big.png                   ✅ InkBot Big Logo (881×427) — для landing
│   └── screenshots/                   ✅ Реальні скріншоти додатку для App Store
│       ├── dashboard.jpg              ✅ Dashboard скріншот
│       ├── generate.jpg               ✅ Generate скріншот
│       ├── bulk.jpg                   ✅ Bulk Generate скріншот
│       ├── brand-voice.jpg            ✅ Brand Voice Settings скріншот
│       └── billing.jpg                ✅ Billing & Plans скріншот
├── інструкції, дизайн, лого, файли/   📋 Дизайн-макети та повний план реалізації
│   ├── describely_implementation_plan.md   ← Детальний план (70+ КБ, стара назва)
│   ├── Публікація InkBot в Shopify App Store.txt  ✅ Чекліст публікації
│   ├── App Store Listing.md           ✅ Tagline, description, screenshot guide
│   ├── InkBot Big Logo.png            ✅ 881×427 — для dashboard
│   ├── InkBot small logo.png          ✅ 1200×1200 — для Shopify Partners app icon
│   ├── Gemini_Generated_Image_*.png   ← UI мокапи (dashboard, generate, mobile)
│   ├── Screenshot 1 - Dashboard.png   ✅ App Store screenshot 1600×900
│   ├── Screenshot 2 - Generate.png    ✅ App Store screenshot 1600×900
│   ├── Screenshot 3 - Bulk Generate.png ✅ App Store screenshot 1600×900
│   ├── Screenshot 4 - Brand Voice.png ✅ App Store screenshot 1600×900
│   └── Screenshot 5 - Billing.png     ✅ App Store screenshot 1600×900
│
├── node_modules/                      ✅ Встановлені
├── package.json                       ✅
├── tsconfig.json                      ✅
├── vite.config.ts                     ✅ Remix + Vite, HMR config
├── shopify.app.toml                   ✅ scopes: read_products, write_products, api_version: 2024-10, embedded: true
├── vercel.json                        ✅ region: fra1, build command з npx prisma generate, Fluid Compute enabled (300s max duration)
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
- **Generate** — product input form, niche/tone/language (111 мов) selectors, generation options checkboxes (Title/Description/Meta/Tags), brand voice indicator, result display з SEO score, copy/apply actions (with tags support), review banner
- **Bulk Generate** — product picker з фільтрами (collection dropdown, status filter, search), generation options checkboxes, "Generated" badge для товарів з історією, batch processing з tags support, review banner
- **Settings** — brand voice config: tone, style, target audience, keywords, avoid words, brand values, custom prompt, sample texts
- **History** — filterable by niche, paginated (10/page), expandable cards з description preview, copy actions
- **Billing** — 4-column plan grid з features list, current plan highlight, upgrade/downgrade/cancel, FAQ section
- **Support** — contact form з auto-fill (shop, plan), email/subject/description, Resend API відправка, автоматичні номери тікетів (#123150+)
- **Components** — UsageCounter, SeoScoreBadge, NicheSelector, ToneSelector, GenerationCard, BulkProductPicker
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
- ✅ Custom domain підключено: `https://inkbot.app`

**Потрібно зробити:**
1. **Тестування в dev store**: перевірити генерацію описів, bulk, settings, billing flow
2. **Додати OPENROUTER_API_KEY** з реальним ключем в Vercel (якщо ще не додано)
3. **Seed niche templates**: викликати `seedNicheTemplates()` з `models/template.server.ts`
4. **UI polish**: перевірити відповідність мокапам з папки інструкцій
5. **App Store submission**: завантажити скріншоти в Shopify Partners → App listing → Submit

**Готово для App Store:**
- ✅ Privacy Policy (`/privacy`) — dark theme, matching landing
- ✅ Terms of Service (`/terms`) — dark theme, matching landing
- ✅ Landing Page (`/landing`) — public marketing page з SEO, hover effects
- ✅ Favicon (`/favicon.png`) — InkBot small logo 1200×1200
- ✅ Tagline (98 символів) — див. `App Store Listing.md`
- ✅ Full Description — див. `App Store Listing.md`
- ✅ Категорії: Store design → Product descriptions, Marketing → SEO
- ✅ Screenshots (5 шт, 1600×900) — згенеровані, збережені в `інструкції, дизайн, лого, файли/Screenshot *.png`

---

## Вирішені проблеми (для контексту)

### Build помилки на Vercel
- `prisma: command not found` → додано `npx` prefix до всіх prisma/remix команд в package.json та vercel.json
- `Server-only module referenced by client` → план-константи (PLAN_LIMITS/PRICES/FEATURES) винесені з `billing.server.ts` у `utils/plans.ts` (без `.server` суфіксу). Аналогічно `GenerateOptions` винесено в `utils/generateOptions.ts`
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
| FREE | $0 | 100 |
| STARTER | $9 | 1,000 |
| PRO | $19 | 10,000 |
| ELITE (key: UNLIMITED) | $99 | 100,000 |

### 9 ніш
fashion, electronics, beauty, food, home, sports, jewelry, pets, general

### Тони
professional, casual, luxurious, playful, technical, minimalist

### Мови (111 мов)

Визначені в єдиному файлі `app/utils/languages.ts` (shared client+server, single source of truth).
Імпортується в: `ai.server.ts` (LANGUAGE_NAMES для промптів), `app.generate.tsx` та `app.bulk.tsx` (languageOptions для Select), `validation.ts` (Zod enum).

**Основні світові:**
en (English), es (Spanish), fr (French), de (German), it (Italian), pt-BR (Portuguese Brazil), pt-PT (Portuguese Portugal), zh (Chinese Simplified), zh-TW (Chinese Traditional), ja (Japanese), ko (Korean)

**Європейський регіон:**
uk (Ukrainian), pl (Polish), nl (Dutch), sv (Swedish), da (Danish), no/nb/nn (Norwegian), fi (Finnish), cs (Czech), hu (Hungarian), ro (Romanian), el (Greek), tr (Turkish), sq (Albanian), hy (Armenian), az (Azerbaijani), eu (Basque), be (Belarusian), bs (Bosnian), bg (Bulgarian), ca (Catalan), hr (Croatian), et (Estonian), gl (Galician), ka (Georgian), is (Icelandic), ga (Irish), lv (Latvian), lt (Lithuanian), lb (Luxembourgish), mk (Macedonian), mt (Maltese), sr (Serbian), sk (Slovak), sl (Slovenian), cy (Welsh)

**Азійський та Близькосхідний регіон:**
ar (Arabic), ar-na (Arabic North African), hi (Hindi), th (Thai), vi (Vietnamese), id (Indonesian), ms (Malay), bn (Bengali), he (Hebrew), tl (Filipino), fa (Persian), ku (Kurdish), ps (Pashto), uz (Uzbek), kk (Kazakh), ky (Kyrgyz), tk (Turkmen), tg (Tajik), mn (Mongolian), ur (Urdu), pa (Punjabi), gu (Gujarati), mr (Marathi), ta (Tamil), te (Telugu), kn (Kannada), ml (Malayalam), si (Sinhala), ne (Nepali), my (Burmese), km (Khmer), lo (Lao)

**Африканський регіон:**
fr-af (French African), sw (Swahili), af (Afrikaans), am (Amharic), yo (Yoruba), zu (Zulu), xh (Xhosa), ha (Hausa), ig (Igbo), om (Oromo), sn (Shona), rw (Kinyarwanda), so (Somali), mg (Malagasy), ny (Chichewa), ti (Tigrinya), ln (Lingala), wo (Wolof), ff (Fula), st (Sesotho), tn (Setswana)

**Інші:**
eo (Esperanto), la (Latin), haw (Hawaiian), mi (Maori), sm (Samoan), jv (Javanese), su (Sundanese), ceb (Cebuano), ht (Haitian Creole)

Порядок у селекторі: English першою, потім решта алфавітно за label. Prompt містить потрійне підсилення мовної вимоги (system prompt CRITICAL LANGUAGE REQUIREMENT + rule #8 + user prompt IMPORTANT). Legacy `pt` код залишено як fallback.

### Review Banner
- Банер на Dashboard, Generate та Bulk сторінках
- **З'являється тільки після першої генерації** (single або bulk)
- Поле `reviewBannerState String @default("pending")` на моделі Shop
- 3 стани:
  - `"pending"` — банер "Enjoying InkBot?" з кнопкою "Leave a Review" (показується якщо є хоча б 1 генерація)
  - `"clicked"` — банер "Thank you!" з двома кнопками: "I left a review" та "No thanks, dismiss" (після кліку на "Leave a Review", який відкриває `apps.shopify.com/inkbot/reviews` у новій вкладці)
  - `"dismissed"` — банер приховано назавжди (після кліку на будь-яку з двох кнопок)
- Функції в `shop.server.ts`: `markReviewClicked(shopDomain)`, `dismissReviewBanner(shopDomain)`
- Перевірка наявності генерацій: `getGenerationStats()` (Dashboard, Generate) або `getGeneratedProductIds()` (Bulk)

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
- `/guide` — Tutorial/Guide page (dark theme, 10 step-by-step sections, Vimeo video embed, mock UIs + screenshots, scroll animations)
- `/privacy` — Privacy Policy (dark theme, matching landing)
- `/terms` — Terms of Service (dark theme, matching landing)
- `/screenshots` — Screenshot generator для App Store (вимкнено, файл `app/screenshots.tsx.bak`; для повернення — перемістити в `app/routes/screenshots.tsx`)
- Доступні публічно: `https://inkbot.app/landing`, `/guide`, `/privacy`, `/terms`
- **Mobile Navigation**:
  - Hamburger menu для екранів < 768px
  - Animated icon (hamburger ↔ X transition)
  - Mobile menu slides down з smooth transition
  - Desktop nav links приховуються, mobile menu з'являється
- **Landing features**:
  - Navigation з hover effects (animated underline)
  - Hero section з Shopify badge та CTA buttons
  - Features grid (6 feature cards з hover effects)
  - "How it Works" section (3 steps)
  - Pricing grid (4 plans, matching billing page)
  - Final CTA section
  - Footer з links
  - Responsive: stats dividers hidden on mobile, step arrows hidden, footer stacked
- **Styling**: Dark theme (#0a0a0f base), purple/violet gradients (#8b5cf6, #6d28d9), glassmorphism, CSS animations
- **SEO**: Open Graph, Twitter Cards meta tags для Google indexing

### Guide Page (`guide.tsx`)
- Публічна tutorial сторінка `/guide` (без Shopify auth)
- **Hero**: "Step-by-Step Guide" tag, "Get Started with InkBot" title, Vimeo video embed (https://vimeo.com/1163043360) у browser frame
- **10 кроків** з alternating layout (odd: text left / visual right, even: visual left / text right):
  1. Install from Shopify App Store — mock UI (app card з "Add app" button)
  2. Authorize the App — mock UI (OAuth permissions screen)
  3. Dashboard Overview — screenshot `/screenshots/dashboard.jpg`
  4. Generate Your First Description — screenshot `/screenshots/generate.jpg`
  5. Apply Description to Shopify — mock UI (green success state з 5 fields)
  6. Bulk Generate — screenshot `/screenshots/bulk.jpg`
  7. Configure Brand Voice — screenshot `/screenshots/brand-voice.jpg`
  8. View Generation History — mock UI (history list з niche badges, SEO scores)
  9. Upgrade Your Plan — screenshot `/screenshots/billing.jpg`
  10. API Access (Elite Plan) — mock UI (API key + terminal з curl example)
- **Timeline**: вертикальна лінія по центру з numbered step badges
- **Scroll animations**: IntersectionObserver → fadeInUp при появі у viewport
- **Mobile**: stacked layout (visual → text), timeline hidden, responsive at 768px
- **Nav + Footer**: matching landing.tsx design (links to /landing, /landing#features, /landing#pricing)
- Dark theme (#0a0a0f base), purple accents (#8b5cf6), browser frame mockups

### Bulk Format (textarea input)
```
Product Title | Product Type | Feature1, Feature2, Feature3
```

### Generation Options (checkboxes)
Користувач може вибрати що саме генерувати перед запуском:
- **Title** — оптимізований заголовок товару (default: ON)
- **Description** — повний HTML опис з `<p>`, `<ul>`, `<strong>` (default: ON)
- **Meta Title** — SEO заголовок для пошукових систем (default: ON)
- **Meta Description** — SEO опис 155 символів (default: ON)
- **Tags** — теги для Shopify `product.tags` (default: OFF)

Tags вимкнені за замовчуванням, бо вони модифікують товар (записуються через Shopify GraphQL `productUpdate`).

**Реалізація:**
- `app/utils/generateOptions.ts` — shared interface `GenerateOptions` + `DEFAULT_GENERATE_OPTIONS`
- AI prompt будується динамічно на основі вибраних опцій
- Apply action зберігає теги в Shopify через `product.tags` поле

### Bulk Generate Filters
Фільтри для вибору товарів на сторінці Bulk Generate:
- **Collection** — dropdown з усіма колекціями магазину
- **Status** — "All products" / "Not generated" / "Already generated"
- **Search** — пошук по назві товару (debounced 300ms)
- **"Generated" badge** — синій badge біля товарів які вже мають генерації

**Реалізація:**
- `app/utils/shopify.server.ts` — `COLLECTIONS_QUERY`, `PRODUCTS_BY_COLLECTION_QUERY`, `parseCollectionsResponse()`
- `app/models/generation.server.ts` — `getGeneratedProductIds()` повертає Set<string> product IDs
- `app/types/shopify.ts` — `ShopifyCollection` interface
- `app/components/BulkProductPicker.tsx` — UI компонент з фільтрами

---

## Як продовжити роботу

1. Прочитай цей файл для контексту
2. Фази 1-4 повністю завершені, TypeScript чистий (0 помилок), build працює
3. Deployment працює: Vercel + Neon + Shopify Partners
4. Додаток встановлено на dev store
5. **App Store preparation** — готово:
   - ✅ Privacy Policy (`/privacy`)
   - ✅ Terms of Service (`/terms`)
   - ✅ Landing Page (`/landing`) з mobile responsive
   - ✅ Tagline та Full Description
   - ✅ Screenshots (5 шт, 1600×900) — згенеровані через Puppeteer, збережені в `інструкції, дизайн, лого, файли/Screenshot *.png`
   - ✅ Screenshot generator page (вимкнено, `.bak` — можна повернути при потребі)
6. **Наступні кроки**:
   - Завантажити скріншоти в Shopify Partners → App listing
   - Фінальне тестування в dev store
   - Submit to App Store
7. Подивись мокапи в `інструкції, дизайн, лого, файли/` для візуального дизайну
8. App Store listing матеріали: `інструкції, дизайн, лого, файли/App Store Listing.md`
9. Чекліст публікації: `інструкції, дизайн, лого, файли/Публікація InkBot в Shopify App Store.txt`

### Screenshots Page (`app/screenshots.tsx.bak`)
Сторінка для створення App Store скріншотів. Зараз вимкнена (винесена з `routes/` щоб Vite не підхоплював).
Для повернення: перемістити `app/screenshots.tsx.bak` → `app/routes/screenshots.tsx`.

5 блоків 1600×900px, кожен: ліва панель (favicon.png іконка + білий текст "InkBot" + headline + features) + права панель (browser mockup з реальними скріншотами додатку з `public/screenshots/`).

1. **Dashboard** — "Your AI Writing Command Center"
2. **Generate** — "Generate SEO-Optimized Descriptions in Seconds"
3. **Bulk Generate** — "Process Your Entire Catalog at Once" (object-fit: cover)
4. **Brand Voice** — "Train AI to Match Your Brand Voice"
5. **Billing** — "Start Free, Scale As You Grow"

Готові скріншоти (1600×900 PNG) збережені в `інструкції, дизайн, лого, файли/Screenshot *.png`.

### Після деплою на Vercel
```bash
npx prisma db push
```
Це оновить default значення для `generationsLimit` (100 для FREE плану).
