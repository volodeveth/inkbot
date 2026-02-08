import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState, useRef, useCallback } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "InkBot Guide — How to Use AI Product Descriptions for Shopify" },
    { name: "description", content: "Step-by-step guide to using InkBot: install, generate AI product descriptions, bulk process, configure brand voice, and more. Get started in minutes." },
    { property: "og:title", content: "InkBot Guide — How to Use AI Product Descriptions for Shopify" },
    { property: "og:description", content: "Step-by-step guide to using InkBot for AI product descriptions and SEO optimization on Shopify." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inkbot.app/guide" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "InkBot Guide — Get Started" },
    { name: "twitter:description", content: "Learn how to use InkBot for AI product descriptions on Shopify." },
    { name: "robots", content: "index, follow" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

interface StepData {
  number: number;
  title: string;
  description: string;
  bullets: string[];
  visual: "screenshot" | "mock";
  screenshotSrc?: string;
  screenshotAlt?: string;
  mockType?: "install" | "oauth" | "apply" | "history" | "api";
}

const steps: StepData[] = [
  {
    number: 1,
    title: "Install from Shopify App Store",
    description: "Find InkBot in the Shopify App Store and add it to your store with a single click. No technical setup required.",
    bullets: ["Search for \"InkBot\" in the Shopify App Store", "Click \"Add app\" to begin installation", "Free plan starts immediately — no credit card needed"],
    visual: "mock",
    mockType: "install",
  },
  {
    number: 2,
    title: "Authorize the App",
    description: "Grant InkBot the permissions it needs to read your products and write descriptions back to your store.",
    bullets: ["Review requested permissions (read/write products)", "Click \"Install app\" to authorize", "Your data stays secure — we only access product info"],
    visual: "mock",
    mockType: "oauth",
  },
  {
    number: 3,
    title: "Dashboard Overview",
    description: "Your command center shows usage stats, recent generations, average SEO scores, and quick actions at a glance.",
    bullets: ["Track monthly usage with the progress bar", "See your average SEO score across all generations", "Jump to Generate or Bulk with quick action buttons"],
    visual: "screenshot",
    screenshotSrc: "/screenshots/dashboard.jpg",
    screenshotAlt: "InkBot Dashboard",
  },
  {
    number: 4,
    title: "Generate Your First Description",
    description: "Select a product from your Shopify catalog (or enter details manually), pick your niche, tone, and language, then click Generate.",
    bullets: ["Choose from 9 industry niches (Fashion, Electronics, Beauty...)", "Pick a tone: professional, casual, luxurious, playful, technical, or minimalist", "Select any of 111 languages for global reach"],
    visual: "screenshot",
    screenshotSrc: "/screenshots/generate.jpg",
    screenshotAlt: "InkBot Generate Description",
  },
  {
    number: 5,
    title: "Apply Description to Shopify",
    description: "Review the generated title, description, meta tags, and SEO score. One click applies everything directly to your Shopify product.",
    bullets: ["Preview the full description with SEO score", "Click \"Apply to Shopify\" to update your product instantly", "Title, description, meta tags, and product tags are all synced"],
    visual: "mock",
    mockType: "apply",
  },
  {
    number: 6,
    title: "Bulk Generate for Multiple Products",
    description: "Process your entire catalog at once. Filter by collection, status, or search — then batch generate descriptions for all selected products.",
    bullets: ["Filter products by collection or generation status", "Select multiple products with checkboxes", "Batch processing handles up to 3 products concurrently"],
    visual: "screenshot",
    screenshotSrc: "/screenshots/bulk.jpg",
    screenshotAlt: "InkBot Bulk Generate",
  },
  {
    number: 7,
    title: "Configure Brand Voice",
    description: "Train InkBot to match your unique brand identity. Set tone, style, keywords, words to avoid, and provide sample texts for the AI to learn from.",
    bullets: ["Define your brand tone and writing style", "Add keywords to include and words to avoid", "Paste sample texts for AI to analyze your voice"],
    visual: "screenshot",
    screenshotSrc: "/screenshots/brand-voice.jpg",
    screenshotAlt: "InkBot Brand Voice Settings",
  },
  {
    number: 8,
    title: "View Generation History",
    description: "Browse all your past generations, filter by niche, and quickly copy or reuse any description. Full history with pagination.",
    bullets: ["Filter history by niche category", "Expandable cards with full description preview", "Copy any past description with one click"],
    visual: "mock",
    mockType: "history",
  },
  {
    number: 9,
    title: "Upgrade Your Plan",
    description: "Start with 100 free generations per month. Upgrade to Starter, Pro, or Elite as your store grows — all managed through Shopify billing.",
    bullets: ["Free: 100/mo, Starter: 1,000/mo ($9), Pro: 10,000/mo ($19)", "Elite: 100,000/mo ($99) with API access", "Upgrade or downgrade anytime, no contracts"],
    visual: "screenshot",
    screenshotSrc: "/screenshots/billing.jpg",
    screenshotAlt: "InkBot Billing Plans",
  },
  {
    number: 10,
    title: "API Access (Elite Plan)",
    description: "Integrate InkBot into your own workflow with the REST API. Generate API keys, use Bearer authentication, and automate description generation.",
    bullets: ["Generate a secure API key from the API page", "Use Bearer token authentication in your requests", "Supports both single and bulk generation endpoints"],
    visual: "mock",
    mockType: "api",
  },
];

function InstallMock() {
  return (
    <div style={mockStyles.installCard}>
      <div style={mockStyles.installHeader}>
        <div style={mockStyles.installIconWrap}>
          <img src="/favicon.png" alt="InkBot" style={mockStyles.installIcon} />
        </div>
        <div>
          <div style={mockStyles.installName}>InkBot — AI Product Descriptions & SEO</div>
          <div style={mockStyles.installRating}>
            <span style={{ color: "#facc15" }}>★★★★★</span>
            <span style={{ color: "#71717a", marginLeft: "8px", fontSize: "13px" }}>Shopify App</span>
          </div>
        </div>
      </div>
      <div style={mockStyles.installFeatures}>
        <div style={mockStyles.installFeatureRow}>
          <span style={mockStyles.installCheck}>✓</span> AI-generated product descriptions
        </div>
        <div style={mockStyles.installFeatureRow}>
          <span style={mockStyles.installCheck}>✓</span> SEO optimization with meta tags
        </div>
        <div style={mockStyles.installFeatureRow}>
          <span style={mockStyles.installCheck}>✓</span> 111 languages, 9 industry niches
        </div>
      </div>
      <div style={mockStyles.installPricing}>
        <span style={{ color: "#a1a1aa", fontSize: "14px" }}>Free plan available</span>
        <span style={{ color: "#ffffff", fontWeight: "600" }}>$0/month</span>
      </div>
      <button style={mockStyles.installButton}>Add app</button>
    </div>
  );
}

function OAuthMock() {
  return (
    <div style={mockStyles.oauthCard}>
      <div style={mockStyles.oauthHeader}>
        <div style={mockStyles.oauthIconWrap}>
          <img src="/favicon.png" alt="InkBot" style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
        </div>
        <div style={{ fontSize: "18px", fontWeight: "600", color: "#ffffff" }}>InkBot wants to access your store</div>
      </div>
      <div style={mockStyles.oauthPerms}>
        <div style={mockStyles.oauthPermTitle}>This app will be able to:</div>
        {["Read products, variants, and collections", "Write product descriptions and meta tags", "Write product tags"].map((perm, i) => (
          <div key={i} style={mockStyles.oauthPermRow}>
            <span style={mockStyles.oauthPermCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span style={{ color: "#d4d4d8", fontSize: "14px" }}>{perm}</span>
          </div>
        ))}
      </div>
      <div style={mockStyles.oauthActions}>
        <button style={mockStyles.oauthCancelBtn}>Cancel</button>
        <button style={mockStyles.oauthInstallBtn}>Install app</button>
      </div>
    </div>
  );
}

function ApplyMock() {
  return (
    <div style={mockStyles.applyCard}>
      <div style={mockStyles.applySuccess}>
        <div style={mockStyles.applyCheckCircle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontSize: "20px", fontWeight: "600", color: "#22c55e" }}>Applied to Shopify</div>
        <div style={{ fontSize: "14px", color: "#a1a1aa", marginTop: "4px" }}>All fields updated successfully</div>
      </div>
      <div style={mockStyles.applyFields}>
        {[
          { label: "Title", value: "Premium Wireless Headphones — Active Noise Cancelling", icon: "✏️" },
          { label: "Description", value: "HTML description with SEO keywords applied", icon: "📝" },
          { label: "Meta Title", value: "Buy Premium Wireless Headphones | Free Shipping", icon: "🔍" },
          { label: "Meta Description", value: "Experience crystal-clear audio with 40hr battery...", icon: "📋" },
          { label: "Tags", value: "wireless, headphones, noise-cancelling, premium-audio", icon: "🏷️" },
        ].map((field, i) => (
          <div key={i} style={mockStyles.applyFieldRow}>
            <span style={{ fontSize: "16px", width: "24px" }}>{field.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{field.label}</div>
              <div style={{ fontSize: "13px", color: "#d4d4d8", marginTop: "2px" }}>{field.value}</div>
            </div>
            <span style={{ color: "#22c55e", fontSize: "14px" }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryMock() {
  return (
    <div style={mockStyles.historyCard}>
      <div style={mockStyles.historyHeader}>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "#ffffff" }}>Generation History</div>
        <div style={mockStyles.historyFilter}>
          <span style={{ color: "#a1a1aa", fontSize: "13px" }}>Filter:</span>
          <span style={mockStyles.historyFilterBadge}>All Niches ▾</span>
        </div>
      </div>
      {[
        { product: "Premium Wireless Headphones", niche: "Electronics", seo: 94, date: "2 hours ago", nicheColor: "#3b82f6" },
        { product: "Organic Face Serum", niche: "Beauty", seo: 88, date: "Yesterday", nicheColor: "#ec4899" },
        { product: "Running Shoes Pro X", niche: "Sports", seo: 91, date: "2 days ago", nicheColor: "#22c55e" },
      ].map((item, i) => (
        <div key={i} style={mockStyles.historyRow}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#ffffff" }}>{item.product}</div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
              <span style={{ ...mockStyles.nicheBadge, background: `${item.nicheColor}20`, color: item.nicheColor }}>{item.niche}</span>
              <span style={{ fontSize: "12px", color: "#71717a" }}>{item.date}</span>
            </div>
          </div>
          <div style={{ ...mockStyles.seoScoreBadge, background: item.seo >= 90 ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)", color: item.seo >= 90 ? "#22c55e" : "#eab308" }}>
            SEO: {item.seo}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApiMock() {
  return (
    <div style={mockStyles.apiCard}>
      <div style={mockStyles.apiKeySection}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>Your API Key</div>
        <div style={mockStyles.apiKeyRow}>
          <code style={mockStyles.apiKeyValue}>dsc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</code>
          <button style={mockStyles.apiCopyBtn}>Copy</button>
        </div>
        <div style={{ fontSize: "12px", color: "#71717a", marginTop: "6px" }}>Elite plan only. Keep this key secret.</div>
      </div>
      <div style={mockStyles.terminalWrap}>
        <div style={mockStyles.terminalHeader}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57" }}></span>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></span>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28ca41" }}></span>
          </div>
          <span style={{ fontSize: "12px", color: "#71717a" }}>Terminal</span>
        </div>
        <div style={mockStyles.terminalBody}>
          <div><span style={{ color: "#22c55e" }}>$</span> <span style={{ color: "#a78bfa" }}>curl</span> -X POST https://inkbot.app/api/generate \</div>
          <div style={{ paddingLeft: "16px" }}>-H <span style={{ color: "#fbbf24" }}>"Authorization: Bearer dsc_a1b2..."</span> \</div>
          <div style={{ paddingLeft: "16px" }}>-H <span style={{ color: "#fbbf24" }}>"Content-Type: application/json"</span> \</div>
          <div style={{ paddingLeft: "16px" }}>-d <span style={{ color: "#fbbf24" }}>{"'{\"productTitle\": \"...\", \"niche\": \"electronics\"}'".replace(/'/g, "'")}</span></div>
        </div>
      </div>
    </div>
  );
}

function BrowserFrame({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div className="guide-browser-window">
      <div style={frameStyles.header}>
        <div style={frameStyles.dots}>
          <span style={{ ...frameStyles.dot, background: "#ff5f57" }}></span>
          <span style={{ ...frameStyles.dot, background: "#ffbd2e" }}></span>
          <span style={{ ...frameStyles.dot, background: "#28ca41" }}></span>
        </div>
        <div style={frameStyles.url}>{url}</div>
      </div>
      <div style={frameStyles.content}>
        {children}
      </div>
    </div>
  );
}

function StepVisual({ step }: { step: StepData }) {
  if (step.visual === "screenshot" && step.screenshotSrc) {
    return (
      <BrowserFrame url={`inkbot.app${step.screenshotSrc.replace("/screenshots/", "/app/").replace(".jpg", "").replace("brand-voice", "settings")}`}>
        <img
          src={step.screenshotSrc}
          alt={step.screenshotAlt || ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
        />
      </BrowserFrame>
    );
  }

  const mockMap: Record<string, React.ReactNode> = {
    install: <InstallMock />,
    oauth: <OAuthMock />,
    apply: <ApplyMock />,
    history: <HistoryMock />,
    api: <ApiMock />,
  };

  return (
    <div style={{ width: "100%" }}>
      {step.mockType && mockMap[step.mockType]}
    </div>
  );
}

export default function Guide() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  const setStepRef = useCallback((el: HTMLDivElement | null, index: number) => {
    stepRefs.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-step-index"));
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={styles.wrapper}>
      <style>{globalStyles}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <a href="/landing" style={{ textDecoration: "none" }}>
            <div style={styles.logo} className="logo">
              <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
              <span style={styles.logoText}>InkBot</span>
            </div>
          </a>

          <div style={styles.navLinks} className="nav-links-desktop">
            <a href="/landing" style={styles.navLink} className="nav-link">Home</a>
            <a href="/landing#features" style={styles.navLink} className="nav-link">Features</a>
            <a href="/landing#pricing" style={styles.navLink} className="nav-link">Pricing</a>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.ctaNavButton}
              className="cta-btn"
            >
              Install Free
            </button>
          </div>

          <button
            style={styles.mobileMenuButton}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{ ...styles.hamburgerLine, transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
            <span style={{ ...styles.hamburgerLine, opacity: mobileMenuOpen ? 0 : 1 }}></span>
            <span style={{ ...styles.hamburgerLine, transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}></span>
          </button>
        </div>

        <div
          style={{
            ...styles.mobileMenu,
            maxHeight: mobileMenuOpen ? "300px" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            padding: mobileMenuOpen ? "20px 24px" : "0 24px",
          }}
          className="mobile-menu"
        >
          <a href="/landing" style={styles.mobileNavLink} className="mobile-nav-link">Home</a>
          <a href="/landing#features" style={styles.mobileNavLink} className="mobile-nav-link">Features</a>
          <a href="/landing#pricing" style={styles.mobileNavLink} className="mobile-nav-link">Pricing</a>
          <button
            onClick={() => { handleExternalLink("https://apps.shopify.com/inkbot"); setMobileMenuOpen(false); }}
            style={styles.mobileCtaButton}
            className="cta-btn"
          >
            Install Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroGlow}></div>
        <div style={styles.heroContent}>
          <span style={styles.sectionTag}>Step-by-Step Guide</span>
          <h1 style={styles.heroTitle}>
            Get Started with
            <br />
            <span style={styles.heroGradient}>InkBot</span>
          </h1>
          <p style={styles.heroSubtitle}>
            From installation to your first AI-generated product description in minutes.
            <br />
            Follow these 10 simple steps.
          </p>
        </div>

        {/* Video Embed */}
        <div style={styles.videoContainer} className="guide-video-container">
          <div className="guide-browser-window" style={{ maxWidth: "900px", width: "100%" }}>
            <div style={frameStyles.header}>
              <div style={frameStyles.dots}>
                <span style={{ ...frameStyles.dot, background: "#ff5f57" }}></span>
                <span style={{ ...frameStyles.dot, background: "#ffbd2e" }}></span>
                <span style={{ ...frameStyles.dot, background: "#28ca41" }}></span>
              </div>
              <div style={frameStyles.url}>InkBot — Video Tutorial</div>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", background: "#000" }}>
              <iframe
                src="https://player.vimeo.com/video/1163043360?badge=0&autopause=0&player_id=0&app_id=58479"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                title="InkBot Tutorial"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={styles.stepsSection}>
        <div style={styles.stepsContainer}>
          {/* Timeline line */}
          <div style={styles.timelineLine} className="guide-timeline-line"></div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            const isVisible = visibleSteps.has(index);

            return (
              <div
                key={step.number}
                ref={(el) => setStepRef(el, index)}
                data-step-index={index}
                className={`guide-step-row ${isEven ? "guide-step-even" : "guide-step-odd"} ${isVisible ? "guide-step-visible" : ""}`}
                style={styles.stepRow}
              >
                {/* Step Number Badge (centered on timeline) */}
                <div style={styles.stepBadge} className="guide-step-badge">
                  <span style={styles.stepBadgeNumber}>{step.number}</span>
                </div>

                {/* Text Side */}
                <div className={`guide-step-text ${isEven ? "guide-step-text-right" : "guide-step-text-left"}`} style={styles.stepText}>
                  <h3 style={styles.stepTitle}>{step.title}</h3>
                  <p style={styles.stepDescription}>{step.description}</p>
                  <ul style={styles.stepBullets}>
                    {step.bullets.map((bullet, i) => (
                      <li key={i} style={styles.stepBullet}>
                        <span style={styles.bulletCheck}>✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual Side */}
                <div className={`guide-step-visual ${isEven ? "guide-step-visual-left" : "guide-step-visual-right"}`} style={styles.stepVisual}>
                  <StepVisual step={step} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaGlow}></div>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaSubtitle}>
            Install InkBot now and generate your first AI-powered
            product description in under a minute.
          </p>
          <button
            onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
            style={styles.ctaButtonLarge}
            className="btn-primary"
          >
            Install InkBot Free
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <p style={styles.ctaNote}>Free plan includes 100 generations/month. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerTop} className="footer-top">
            <div style={styles.footerBrand} className="footer-brand">
              <div style={styles.logo} className="logo">
                <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
                <span style={styles.logoText}>InkBot</span>
              </div>
              <p style={styles.footerTagline}>
                AI-powered product descriptions for Shopify merchants.
                <br />
                Available on Shopify App Store.
              </p>
            </div>
            <div style={styles.footerLinks} className="footer-links">
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Product</h4>
                <a href="/landing#features" style={styles.footerLink} className="footer-link">Features</a>
                <a href="/landing#pricing" style={styles.footerLink} className="footer-link">Pricing</a>
                <a href="/guide" style={styles.footerLink} className="footer-link">Guide</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Legal</h4>
                <a href="/privacy" style={styles.footerLink} className="footer-link">Privacy Policy</a>
                <a href="/terms" style={styles.footerLink} className="footer-link">Terms of Service</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Install</h4>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleExternalLink("https://apps.shopify.com/inkbot"); }}
                  style={styles.footerLink}
                  className="footer-link"
                >
                  Shopify App Store
                </a>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom} className="footer-bottom">
            <p style={styles.copyright}>&copy; 2026 InkBot. All rights reserved.</p>
            <p style={styles.builtBy}>
              Built by{" "}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleExternalLink("https://volodeveth.vercel.app/"); }}
                style={styles.authorLink}
              >
                VoloDev.eth
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Global CSS ──────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0f;
    color: #ffffff;
    overflow-x: hidden;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Navigation links */
  .nav-link {
    position: relative;
    transition: color 0.3s ease;
  }
  .nav-link:hover {
    color: #ffffff !important;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4);
    transition: width 0.3s ease;
  }
  .nav-link:hover::after {
    width: 100%;
  }

  .cta-btn {
    transition: all 0.3s ease;
  }
  .cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4) !important;
  }

  .btn-primary {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .btn-primary:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.5) !important;
  }
  .btn-primary:hover::before {
    left: 100%;
  }

  /* Logo */
  .logo {
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .logo:hover {
    transform: scale(1.05);
  }
  .logo:hover img {
    transform: rotate(10deg);
  }
  .logo img {
    transition: all 0.3s ease;
  }

  /* Footer links */
  .footer-link {
    transition: all 0.3s ease;
    position: relative;
  }
  .footer-link:hover {
    color: #a78bfa !important;
    transform: translateX(3px);
  }

  .mobile-nav-link {
    transition: all 0.3s ease;
  }
  .mobile-nav-link:hover {
    color: #a78bfa !important;
    transform: translateX(5px);
  }

  /* Browser window hover */
  .guide-browser-window {
    background: rgba(26, 26, 46, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    transition: all 0.4s ease;
  }
  .guide-browser-window:hover {
    box-shadow: 0 35px 70px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.3);
  }

  /* Steps animation */
  .guide-step-row {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  }
  .guide-step-row.guide-step-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Step badge glow */
  .guide-step-badge {
    transition: all 0.3s ease;
  }
  .guide-step-row:hover .guide-step-badge {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
    transform: scale(1.1);
  }

  /* Timeline line */
  .guide-timeline-line {
    display: block;
  }

  /* Desktop layout: alternating sides */
  @media (min-width: 769px) {
    .guide-step-row {
      display: grid;
      grid-template-columns: 1fr 60px 1fr;
      align-items: center;
      gap: 0;
    }

    .guide-step-badge {
      grid-column: 2;
      grid-row: 1;
      justify-self: center;
      z-index: 2;
    }

    /* Odd steps: text left, visual right */
    .guide-step-odd .guide-step-text-left {
      grid-column: 1;
      grid-row: 1;
      text-align: right;
      padding-right: 40px;
    }
    .guide-step-odd .guide-step-visual-right {
      grid-column: 3;
      grid-row: 1;
      padding-left: 40px;
    }

    /* Even steps: visual left, text right */
    .guide-step-even .guide-step-visual-left {
      grid-column: 1;
      grid-row: 1;
      padding-right: 40px;
    }
    .guide-step-even .guide-step-text-right {
      grid-column: 3;
      grid-row: 1;
      text-align: left;
      padding-left: 40px;
    }

    /* Even steps: align bullets left */
    .guide-step-even .guide-step-text-right ul {
      align-items: flex-start;
    }
    /* Odd steps: align bullets right */
    .guide-step-odd .guide-step-text-left ul {
      align-items: flex-end;
    }
  }

  /* Mobile layout: stacked */
  @media (max-width: 768px) {
    .nav-links-desktop {
      display: none !important;
    }
    .mobile-menu-btn {
      display: flex !important;
    }
    .mobile-menu {
      display: flex !important;
    }

    .guide-timeline-line {
      display: none !important;
    }

    .guide-step-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .guide-step-badge {
      position: static !important;
    }

    .guide-step-text,
    .guide-step-text-left,
    .guide-step-text-right {
      text-align: center !important;
      padding: 0 !important;
      order: 2;
    }

    .guide-step-visual,
    .guide-step-visual-left,
    .guide-step-visual-right {
      padding: 0 !important;
      order: 1;
      width: 100%;
    }

    .guide-step-text ul {
      align-items: flex-start !important;
    }

    .guide-video-container {
      padding: 0 8px !important;
    }

    .footer-top {
      flex-direction: column;
      text-align: center;
    }
    .footer-brand {
      max-width: 100% !important;
    }
    .footer-links {
      justify-content: center;
    }
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }

  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none !important;
    }
    .mobile-menu {
      display: none !important;
    }
  }
`;

// ─── Browser Frame Styles ────────────────────────────────────────────────────

const frameStyles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    background: "rgba(0, 0, 0, 0.3)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  dots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  url: {
    fontSize: "12px",
    color: "#71717a",
    flex: 1,
  },
  content: {
    overflow: "hidden",
    background: "#f1f1f1",
    minHeight: "200px",
  },
};

// ─── Mock UI Styles ──────────────────────────────────────────────────────────

const mockStyles: Record<string, React.CSSProperties> = {
  // Install mock
  installCard: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "28px",
    width: "100%",
  },
  installHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  installIconWrap: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    overflow: "hidden",
    flexShrink: 0,
  },
  installIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
  },
  installName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "4px",
  },
  installRating: {
    fontSize: "14px",
  },
  installFeatures: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  installFeatureRow: {
    fontSize: "14px",
    color: "#d4d4d8",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  installCheck: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "14px",
  },
  installPricing: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  installButton: {
    width: "100%",
    padding: "14px",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // OAuth mock
  oauthCard: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "28px",
    width: "100%",
  },
  oauthHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  oauthIconWrap: {
    flexShrink: 0,
  },
  oauthPerms: {
    marginBottom: "24px",
  },
  oauthPermTitle: {
    fontSize: "13px",
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    marginBottom: "14px",
  },
  oauthPermRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  oauthPermCheck: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    background: "rgba(139, 92, 246, 0.1)",
    borderRadius: "6px",
    flexShrink: 0,
  },
  oauthActions: {
    display: "flex",
    gap: "12px",
  },
  oauthCancelBtn: {
    flex: 1,
    padding: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#a1a1aa",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  oauthInstallBtn: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Apply mock
  applyCard: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "28px",
    width: "100%",
  },
  applySuccess: {
    textAlign: "center" as const,
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  applyCheckCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "rgba(34, 197, 94, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  applyFields: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  applyFieldRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    border: "1px solid rgba(34, 197, 94, 0.1)",
  },

  // History mock
  historyCard: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "24px",
    width: "100%",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  historyFilter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  historyFilterBadge: {
    background: "rgba(139, 92, 246, 0.1)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "13px",
    color: "#a78bfa",
  },
  historyRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
  },
  nicheBadge: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
  },
  seoScoreBadge: {
    padding: "4px 10px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap" as const,
  },

  // API mock
  apiCard: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "24px",
    width: "100%",
  },
  apiKeySection: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  apiKeyRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  apiKeyValue: {
    flex: 1,
    padding: "10px 12px",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "13px",
    color: "#a78bfa",
    fontFamily: "'Fira Code', 'SF Mono', Monaco, monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  apiCopyBtn: {
    padding: "10px 16px",
    background: "rgba(139, 92, 246, 0.2)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "8px",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  },
  terminalWrap: {
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  terminalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "rgba(0, 0, 0, 0.4)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  terminalBody: {
    padding: "16px",
    background: "rgba(0, 0, 0, 0.5)",
    fontFamily: "'Fira Code', 'SF Mono', Monaco, monospace",
    fontSize: "12px",
    lineHeight: "1.8",
    color: "#d4d4d8",
    overflowX: "auto" as const,
  },
};

// ─── Page Styles ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Nav
  nav: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: "16px 24px",
    background: "rgba(10, 10, 15, 0.8)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImage: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLink: {
    color: "#a1a1aa",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  ctaNavButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  mobileMenuButton: {
    display: "none",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    width: "40px",
    height: "40px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
  },
  hamburgerLine: {
    width: "24px",
    height: "2px",
    background: "#ffffff",
    transition: "all 0.3s ease",
  },
  mobileMenu: {
    display: "none",
    flexDirection: "column" as const,
    gap: "16px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  mobileNavLink: {
    color: "#a1a1aa",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 0",
    display: "block",
  },
  mobileCtaButton: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  // Hero
  hero: {
    position: "relative" as const,
    padding: "140px 24px 60px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute" as const,
    top: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "800px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  heroContent: {
    textAlign: "center" as const,
    maxWidth: "800px",
    zIndex: 1,
    marginBottom: "48px",
  },
  sectionTag: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(139, 92, 246, 0.1)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#a78bfa",
    marginBottom: "16px",
  },
  heroTitle: {
    fontSize: "clamp(36px, 5vw, 64px)",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "20px",
    color: "#ffffff",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)",
    backgroundSize: "200% 200%",
    animation: "gradient 5s ease infinite",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#a1a1aa",
  },
  videoContainer: {
    width: "100%",
    maxWidth: "900px",
    zIndex: 1,
    padding: "0 24px",
  },

  // Steps section
  stepsSection: {
    padding: "80px 24px 120px",
  },
  stepsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "80px",
  },
  timelineLine: {
    position: "absolute" as const,
    left: "50%",
    top: 0,
    bottom: 0,
    width: "2px",
    background: "linear-gradient(180deg, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(139, 92, 246, 0.4) 100%)",
    transform: "translateX(-50%)",
    zIndex: 0,
  },
  stepRow: {},
  stepBadge: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 0 6px rgba(10, 10, 15, 1)",
    flexShrink: 0,
  },
  stepBadgeNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
  },
  stepText: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
  },
  stepDescription: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#a1a1aa",
  },
  stepBullets: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginTop: "4px",
  },
  stepBullet: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#d4d4d8",
  },
  bulletCheck: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },
  stepVisual: {},

  // CTA
  cta: {
    position: "relative" as const,
    padding: "120px 24px",
    textAlign: "center" as const,
    overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  ctaContainer: {
    position: "relative" as const,
    zIndex: 1,
    maxWidth: "700px",
    margin: "0 auto",
  },
  ctaTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#ffffff",
  },
  ctaSubtitle: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#a1a1aa",
    marginBottom: "40px",
  },
  ctaButtonLarge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "20px 40px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "14px",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(139, 92, 246, 0.5)",
  },
  ctaNote: {
    fontSize: "14px",
    color: "#71717a",
    marginTop: "20px",
  },

  // Footer
  footer: {
    padding: "64px 24px 32px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  footerTop: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "48px",
    marginBottom: "48px",
  },
  footerBrand: {
    maxWidth: "300px",
  },
  footerTagline: {
    fontSize: "14px",
    color: "#71717a",
    marginTop: "12px",
    lineHeight: "1.6",
  },
  footerLinks: {
    display: "flex",
    gap: "64px",
    flexWrap: "wrap" as const,
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  footerHeading: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "4px",
  },
  footerLink: {
    fontSize: "14px",
    color: "#71717a",
    textDecoration: "none",
    cursor: "pointer",
  },
  footerBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "16px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  copyright: {
    fontSize: "14px",
    color: "#52525b",
  },
  builtBy: {
    fontSize: "14px",
    color: "#52525b",
  },
  authorLink: {
    color: "#8b5cf6",
    textDecoration: "none",
  },
};
