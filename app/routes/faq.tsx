import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "FAQ — InkBot | AI Product Descriptions & SEO for Shopify" },
    { name: "description", content: "Frequently asked questions about InkBot — AI-powered product description generator for Shopify. Learn about features, pricing, SEO, bulk generation, and more." },
    { property: "og:title", content: "FAQ — InkBot | AI Product Descriptions & SEO" },
    { property: "og:description", content: "Find answers to common questions about InkBot — AI product descriptions, SEO optimization, pricing, and more." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inkbot.app/faq" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "FAQ — InkBot" },
    { name: "twitter:description", content: "Frequently asked questions about InkBot — AI product descriptions for Shopify." },
    { name: "robots", content: "index, follow" },
  ];
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is InkBot?",
        answer: "InkBot is an AI-powered Shopify app that generates unique, SEO-optimized product descriptions for your store. Simply select a product, choose your niche, tone, and language — and get a ready-to-use description with meta tags, SEO score, and recommended keywords in seconds.",
      },
      {
        question: "How do I get started?",
        answer: "Install InkBot from the Shopify App Store, open the app from your Shopify admin, select a product (or enter details manually), choose your niche, tone, and language, then click Generate. Your AI-powered description is ready instantly — one click to apply it to your Shopify product.",
      },
      {
        question: "Do I need any technical knowledge?",
        answer: "Not at all! InkBot is designed to be fully automated and beginner-friendly. No coding, no prompts to write, no SEO expertise required. Just pick your product and generate — the AI handles everything.",
      },
    ],
  },
  {
    title: "AI Generation",
    items: [
      {
        question: "What AI model does InkBot use?",
        answer: "InkBot uses an advanced AI model (DeepSeek V3) specifically optimized for e-commerce product copywriting. It understands product features, industry jargon, and SEO best practices to create descriptions that both read naturally and rank well in search engines.",
      },
      {
        question: "How many languages are supported?",
        answer: "InkBot supports 111 languages, including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Ukrainian, Polish, and many more. Each description is generated natively in the selected language — not translated — for authentic, natural-sounding copy.",
      },
      {
        question: "What are niches and tones?",
        answer: "Niches are industry-specific presets (Fashion, Electronics, Beauty, Food, Home, Sports, Jewelry, Pets, and General) that tailor the AI's vocabulary and structure to your product category. Tones (Professional, Casual, Luxurious, Playful, Technical, Minimalist) control the writing style and voice of the generated content.",
      },
      {
        question: "What is Brand Voice?",
        answer: "Brand Voice is a customization feature that lets you train the AI to match your brand's unique style. You can set your preferred tone, writing style, target audience, keywords to include or avoid, brand values, and even provide sample texts. The AI uses this profile for every generation.",
      },
      {
        question: "Can I choose what to generate?",
        answer: "Yes! Before generating, you can select exactly what you need: Product Title, Description, Meta Title, Meta Description, and Tags. Each option can be toggled on or off independently, so you only generate what you need.",
      },
    ],
  },
  {
    title: "Bulk Generation",
    items: [
      {
        question: "How does bulk generation work?",
        answer: "Select multiple products from your Shopify catalog using the product picker (with filters by collection, status, and search). Click Generate and InkBot processes all selected products in batches. You can review each result and apply them to your store with one click.",
      },
      {
        question: "Is there a limit on bulk generation?",
        answer: "Bulk generation is limited by your plan's monthly quota. Each product counts as one generation. You can select up to 25 products per batch. If you have a large catalog, simply run multiple batches within your monthly limit.",
      },
    ],
  },
  {
    title: "SEO & Optimization",
    items: [
      {
        question: "What is the SEO score?",
        answer: "Every generated description receives an SEO score from 0 to 100, calculated based on keyword usage, content length, readability, meta tag quality, and structure. A higher score means better search engine optimization. Green (80+) is excellent, yellow (60-79) is good, and red (below 60) needs improvement.",
      },
      {
        question: "Does InkBot update my Shopify products directly?",
        answer: "Yes! After generating a description, click the \"Apply\" button to push the title, description, meta tags, and tags directly to your Shopify product. The changes appear in your store immediately — no copy-pasting needed.",
      },
    ],
  },
  {
    title: "Plans & Billing",
    items: [
      {
        question: "Is there a free plan?",
        answer: "Yes! The Free plan includes 100 generations per month at no cost, with access to all 9 niches, 111 languages, and SEO optimization. No credit card required. It's perfect for trying out InkBot or for stores with smaller catalogs.",
      },
      {
        question: "Can I change my plan?",
        answer: "Absolutely. You can upgrade or downgrade your plan at any time from the Billing page inside the app. Changes take effect immediately through Shopify's billing system.",
      },
      {
        question: "When does my usage reset?",
        answer: "Your generation count resets on the first day of each calendar month. Any unused generations do not carry over to the next month.",
      },
      {
        question: "What happens if I exceed my monthly limit?",
        answer: "If you reach your plan's monthly generation limit, you'll need to either wait for the next month's reset or upgrade to a higher plan for more generations.",
      },
    ],
  },
  {
    title: "API Access",
    items: [
      {
        question: "Can I use InkBot via API?",
        answer: "Yes! The Elite plan ($99/month) includes full API access with Bearer key authentication. You can generate descriptions programmatically, integrate with your own tools, and automate workflows. API documentation and key management are available in the API section of the app.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      {
        question: "Is my data secure?",
        answer: "Yes. InkBot uses HTTPS encryption for all data in transit, encrypted database storage, and secure OAuth 2.0 authentication via Shopify. We don't store your product data permanently — only generation history for your reference. API keys are hashed with SHA-256. For full details, see our Privacy Policy.",
      },
      {
        question: "What happens when I uninstall InkBot?",
        answer: "When you uninstall InkBot, your account data (including generation history, brand voice settings, and API keys) is automatically deleted within 30 days in accordance with our data retention policy and Shopify's requirements.",
      },
    ],
  },
];

export default function FAQ() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.wrapper}>
      <style>{globalStyles}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <a href="/landing" style={styles.logo}>
            <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
            <span style={styles.logoText}>InkBot</span>
          </a>

          {/* Desktop Navigation */}
          <div style={styles.navLinks} className="nav-links-desktop">
            <a href="/landing" style={styles.navLink}>Home</a>
            <a href="/privacy" style={styles.navLink}>Privacy</a>
            <a href="/terms" style={styles.navLink}>Terms</a>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.ctaButton}
            >
              Install App
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuButton}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span style={{
              ...styles.hamburgerLine,
              transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}></span>
            <span style={{
              ...styles.hamburgerLine,
              opacity: mobileMenuOpen ? 0 : 1,
            }}></span>
            <span style={{
              ...styles.hamburgerLine,
              transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          style={{
            ...styles.mobileMenu,
            maxHeight: mobileMenuOpen ? "250px" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            padding: mobileMenuOpen ? "20px 24px" : "0 24px",
          }}
          className="mobile-menu"
        >
          <a href="/landing" style={styles.mobileNavLink}>Home</a>
          <a href="/privacy" style={styles.mobileNavLink}>Privacy</a>
          <a href="/terms" style={styles.mobileNavLink}>Terms</a>
          <button
            onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
            style={styles.mobileCtaButton}
          >
            Install App
          </button>
        </div>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          <header style={styles.header}>
            <h1 style={styles.title}>Frequently Asked Questions</h1>
            <p style={styles.subtitle}>InkBot — AI Product Descriptions & SEO</p>
          </header>

          <div style={styles.content}>
            {faqCategories.map((category, catIndex) => (
              <section key={catIndex} style={styles.category}>
                <h2 style={styles.categoryTitle}>{category.title}</h2>
                <div style={styles.itemsList}>
                  {category.items.map((item, itemIndex) => {
                    const key = `${catIndex}-${itemIndex}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div key={itemIndex} style={styles.faqItem} className="faq-item">
                        <button
                          onClick={() => toggleItem(catIndex, itemIndex)}
                          style={styles.faqQuestion}
                          className="faq-question"
                          aria-expanded={isOpen}
                        >
                          <span style={styles.questionText}>{item.question}</span>
                          <span style={{
                            ...styles.chevron,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </button>
                        <div style={{
                          ...styles.faqAnswer,
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0,
                          padding: isOpen ? "0 20px 20px" : "0 20px",
                        }}>
                          <p style={styles.answerText}>{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p style={styles.copyright}>&copy; 2026 InkBot. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/landing" style={styles.footerLink}>Home</a>
            <a href="/privacy" style={styles.footerLink}>Privacy</a>
            <a href="/terms" style={styles.footerLink}>Terms</a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleExternalLink("https://volodeveth.vercel.app/"); }}
              style={styles.footerLink}
            >
              Built by VoloDev.eth
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
  }

  /* FAQ item hover */
  .faq-item {
    transition: all 0.3s ease;
  }

  .faq-item:hover {
    border-color: rgba(139, 92, 246, 0.4) !important;
  }

  .faq-question {
    transition: all 0.2s ease;
  }

  .faq-question:hover {
    color: #a78bfa !important;
  }

  /* Mobile Responsive */
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

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: "16px 24px",
    background: "rgba(10, 10, 15, 0.9)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  navContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
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
    gap: "24px",
  },
  navLink: {
    color: "#a1a1aa",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  ctaButton: {
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
  main: {
    paddingTop: "100px",
    paddingBottom: "80px",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 24px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "48px",
    paddingBottom: "32px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "16px",
    color: "#a1a1aa",
  },
  content: {},
  category: {
    marginBottom: "40px",
  },
  categoryTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  faqItem: {
    background: "rgba(26, 26, 46, 0.5)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  faqQuestion: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left" as const,
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1.5",
    gap: "16px",
  },
  questionText: {
    flex: 1,
  },
  chevron: {
    flexShrink: 0,
    color: "#8b5cf6",
    transition: "transform 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  faqAnswer: {
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  answerText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#d4d4d8",
    paddingTop: "4px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  footer: {
    padding: "24px",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  },
  footerContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  copyright: {
    fontSize: "14px",
    color: "#52525b",
  },
  footerLinks: {
    display: "flex",
    gap: "24px",
  },
  footerLink: {
    fontSize: "14px",
    color: "#71717a",
    textDecoration: "none",
  },
};
