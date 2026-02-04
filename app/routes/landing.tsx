import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "InkBot — AI Product Descriptions & SEO for Shopify | Generate in Seconds" },
    { name: "description", content: "Generate unique, SEO-optimized product descriptions for your Shopify store with AI. 9 niches, 42 languages, instant results. Try free today!" },
    { name: "keywords", content: "AI product descriptions, Shopify app, SEO optimization, product copywriting, ecommerce AI, bulk descriptions, Shopify SEO" },
    { property: "og:title", content: "InkBot — AI Product Descriptions & SEO for Shopify" },
    { property: "og:description", content: "Generate unique, SEO-optimized product descriptions 10x faster. Trusted by Shopify merchants worldwide." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inkbotapp.vercel.app" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "InkBot — AI Product Descriptions & SEO" },
    { name: "twitter:description", content: "Generate SEO-optimized product descriptions with AI in seconds." },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "VoloDev.eth" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div style={styles.wrapper}>
      <style>{globalStyles}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>
            <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
            <span style={styles.logoText}>InkBot</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" onClick={(e) => handleNavClick(e, "features")} style={styles.navLink}>Features</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} style={styles.navLink}>How It Works</a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} style={styles.navLink}>Pricing</a>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.ctaButton}
            >
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroGlow}></div>
        <div style={styles.heroGlow2}></div>
        <div style={{
          ...styles.heroContent,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease-out",
        }}>
          <div style={styles.badge}>
            <svg width="20" height="20" viewBox="0 0 109 124" fill="#95BF47">
              <path d="M74.7 14.8c-.1-.6-.6-1-1.1-1-.5 0-9.3-.2-9.3-.2s-6.2-6-6.9-6.7c-.7-.7-2-.5-2.5-.3 0 0-1.3.4-3.5 1.1-.4-1.1-.9-2.5-1.5-4C47.1-2.6 42.6.4 42.6.4S41.2 2.1 39.4 5c-.4-.1-.8-.2-1.2-.3-.9-2.9-2.5-5.6-5.3-5.6h-.2c-.8-1-1.8-1.4-2.6-1.4-6.5 0-9.6 8.1-10.6 12.2-2.6.8-4.4 1.4-4.7 1.5-1.4.5-1.5.5-1.7 1.8-.1 1-3.8 29.1-3.8 29.1L36.8 48l19.2-4.2S74.8 15.4 74.7 14.8zM53 10.5c-1.7.5-3.5 1.1-5.5 1.7 0-2.8-.4-6.8-1.7-10.1 4.2.8 6.3 5.6 7.2 8.4zm-8.8 2.7l-11.8 3.7c1.1-4.4 3.3-8.8 7.5-10.3 1.6 2.4 2.6 5.7 2.8 9.3-1 .2-1.4.3-1.4.3l2.9-3zm-7.3-12c.5 0 .9.2 1.4.5-5 2.4-7.4 8.4-8.7 13.4-2.7.8-5.3 1.6-7.8 2.4 1.5-7.3 6.9-16.3 15.1-16.3z"/>
              <path d="M73.6 13.8c-.5 0-9.3-.2-9.3-.2s-6.2-6-6.9-6.7c-.3-.3-.6-.4-.9-.4l-2.7 54.4 26.4-5.7S74 14.4 73.6 13.8z" fill="#5E8E3E"/>
              <path d="M44.2 41.2l-4.4 13c0 0-3.9-2.1-8.6-2.1-7 0-7.3 4.4-7.3 5.5 0 6 15.7 8.3 15.7 22.4 0 11.1-7 18.2-16.5 18.2-11.4 0-17.2-7.1-17.2-7.1l3-10s6 5.1 11.1 5.1c3.3 0 4.7-2.6 4.7-4.5 0-7.9-12.9-8.2-12.9-21.1 0-10.8 7.8-21.4 23.5-21.4 6.1 0 8.9 2 8.9 2z" fill="#fff"/>
            </svg>
            <span style={styles.badgeDot}></span>
            Official Shopify App
          </div>
          <h1 style={styles.heroTitle}>
            AI Product Descriptions
            <br />
            <span style={styles.heroGradient}>For Your Shopify Store</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Generate unique, SEO-optimized descriptions in your brand voice.
            <br />
            Built for Shopify. 42 languages. 9 niches. Instant results.
          </p>
          <div style={styles.heroButtons}>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.primaryButton}
            >
              <span>Try Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => handleNavClick({ preventDefault: () => {} } as any, "how-it-works")}
              style={styles.secondaryButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>See How It Works</span>
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>10K+</span>
              <span style={styles.statLabel}>Descriptions Generated</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>42</span>
              <span style={styles.statLabel}>Languages</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>9</span>
              <span style={styles.statLabel}>Industry Niches</span>
            </div>
          </div>

          {/* Shopify Badge */}
          <div style={styles.shopifyBadge}>
            <span style={styles.shopifyBadgeText}>Available on</span>
            <svg width="100" height="28" viewBox="0 0 446 127" fill="#95BF47">
              <path d="M74.7 14.8c-.1-.6-.6-1-1.1-1-.5 0-9.3-.2-9.3-.2s-6.2-6-6.9-6.7c-.7-.7-2-.5-2.5-.3 0 0-1.3.4-3.5 1.1-.4-1.1-.9-2.5-1.5-4C47.1-2.6 42.6.4 42.6.4S41.2 2.1 39.4 5c-.4-.1-.8-.2-1.2-.3-.9-2.9-2.5-5.6-5.3-5.6h-.2c-.8-1-1.8-1.4-2.6-1.4-6.5 0-9.6 8.1-10.6 12.2-2.6.8-4.4 1.4-4.7 1.5-1.4.5-1.5.5-1.7 1.8-.1 1-3.8 29.1-3.8 29.1L36.8 48l19.2-4.2S74.8 15.4 74.7 14.8z"/>
              <path d="M73.6 13.8c-.5 0-9.3-.2-9.3-.2s-6.2-6-6.9-6.7c-.3-.3-.6-.4-.9-.4l-2.7 54.4 26.4-5.7S74 14.4 73.6 13.8z" fill="#5E8E3E"/>
              <path d="M44.2 41.2l-4.4 13c0 0-3.9-2.1-8.6-2.1-7 0-7.3 4.4-7.3 5.5 0 6 15.7 8.3 15.7 22.4 0 11.1-7 18.2-16.5 18.2-11.4 0-17.2-7.1-17.2-7.1l3-10s6 5.1 11.1 5.1c3.3 0 4.7-2.6 4.7-4.5 0-7.9-12.9-8.2-12.9-21.1 0-10.8 7.8-21.4 23.5-21.4 6.1 0 8.9 2 8.9 2z" fill="#fff"/>
              <text x="95" y="85" fill="#ffffff" style={{fontSize: "52px", fontWeight: "600", fontFamily: "Inter, sans-serif"}}>Shopify</text>
            </svg>
          </div>
        </div>

        {/* App Preview */}
        <div style={{
          ...styles.appPreview,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: "all 1s ease-out 0.3s",
        }}>
          <div style={styles.appWindow}>
            <div style={styles.appWindowHeader}>
              <div style={styles.windowDots}>
                <span style={{...styles.windowDot, background: "#ff5f57"}}></span>
                <span style={{...styles.windowDot, background: "#ffbd2e"}}></span>
                <span style={{...styles.windowDot, background: "#28ca41"}}></span>
              </div>
              <span style={styles.windowTitle}>InkBot — Generate Description</span>
            </div>
            <div style={styles.appWindowContent}>
              <div style={styles.mockForm}>
                <div style={styles.mockInput}>
                  <span style={styles.mockLabel}>Product Name</span>
                  <span style={styles.mockValue}>Premium Wireless Headphones</span>
                </div>
                <div style={styles.mockSelect}>
                  <span style={styles.mockLabel}>Niche</span>
                  <span style={styles.mockValue}>🎧 Electronics</span>
                </div>
                <div style={styles.mockResult}>
                  <div style={styles.mockResultHeader}>
                    <span>Generated Description</span>
                    <span style={styles.seoScore}>SEO: 94</span>
                  </div>
                  <p style={styles.mockDescription}>
                    Experience audio perfection with our Premium Wireless Headphones.
                    Featuring advanced noise cancellation technology and 40-hour battery life,
                    these headphones deliver crystal-clear sound for music lovers and professionals alike...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.features}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Features</span>
            <h2 style={styles.sectionTitle}>Everything Your Shopify Store Needs</h2>
            <p style={styles.sectionSubtitle}>
              Powerful AI tools designed specifically for Shopify merchants. One-click integration with your store.
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {[
              {
                icon: "🎯",
                title: "Niche-Specific AI",
                description: "Tailored prompts for Fashion, Electronics, Beauty, Food, Home, Sports, Jewelry, Pets, and more.",
              },
              {
                icon: "🎨",
                title: "Brand Voice Learning",
                description: "Configure your unique tone, style, and keywords. InkBot adapts to match your brand perfectly.",
              },
              {
                icon: "📈",
                title: "SEO Optimization",
                description: "Every description includes meta tags, keywords, and SEO score to boost your search rankings.",
              },
              {
                icon: "⚡",
                title: "Bulk Generation",
                description: "Process hundreds of products at once. Perfect for large catalogs or seasonal updates.",
              },
              {
                icon: "🌍",
                title: "42 Languages",
                description: "Reach global customers with descriptions in English, Spanish, French, German, Chinese, and 37 more.",
              },
              {
                icon: "🛒",
                title: "Shopify Integration",
                description: "One-click apply to your Shopify products. Seamless sync with your store catalog.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  animationDelay: `${index * 0.1}s`,
                }}
                className="feature-card"
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={styles.howItWorks}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>How It Works</span>
            <h2 style={styles.sectionTitle}>Three Steps to Better Descriptions</h2>
            <p style={styles.sectionSubtitle}>
              From product to perfect description in seconds
            </p>
          </div>

          <div style={styles.stepsContainer}>
            {[
              {
                step: "01",
                title: "Select Your Product",
                description: "Choose from your Shopify catalog or enter product details manually. Add features and specifications.",
              },
              {
                step: "02",
                title: "Customize Settings",
                description: "Pick your niche, tone, and language. Your brand voice settings are automatically applied.",
              },
              {
                step: "03",
                title: "Generate & Apply",
                description: "Get your SEO-optimized description instantly. One click to apply it to your Shopify product.",
              },
            ].map((item, index) => (
              <div key={index} style={styles.stepCard}>
                <div style={styles.stepNumber}>{item.step}</div>
                <div style={styles.stepContent}>
                  <h3 style={styles.stepTitle}>{item.title}</h3>
                  <p style={styles.stepDescription}>{item.description}</p>
                </div>
                {index < 2 && <div style={styles.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={styles.pricing}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Pricing</span>
            <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p style={styles.sectionSubtitle}>
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div style={styles.pricingGrid}>
            {[
              {
                name: "Free",
                price: "$0",
                period: "/month",
                description: "Perfect for trying out",
                features: ["10 generations/month", "All 9 niches", "42 languages", "SEO optimization", "Basic support"],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Starter",
                price: "$9",
                period: "/month",
                description: "For growing stores",
                features: ["100 generations/month", "All 9 niches", "42 languages", "SEO optimization", "Brand voice settings", "Email support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/month",
                description: "For active sellers",
                features: ["500 generations/month", "All 9 niches", "42 languages", "SEO optimization", "Brand voice settings", "Bulk generation", "Priority support"],
                cta: "Go Pro",
                popular: true,
              },
              {
                name: "Elite",
                price: "$49",
                period: "/month",
                description: "For power users",
                features: ["5,000 generations/month", "All 9 niches", "42 languages", "SEO optimization", "Brand voice settings", "Bulk generation", "API access", "Premium support"],
                cta: "Go Elite",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                style={{
                  ...styles.pricingCard,
                  ...(plan.popular ? styles.pricingCardPopular : {}),
                }}
              >
                {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
                <h3 style={styles.planName}>{plan.name}</h3>
                <div style={styles.planPrice}>
                  <span style={styles.priceAmount}>{plan.price}</span>
                  <span style={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p style={styles.planDescription}>{plan.description}</p>
                <ul style={styles.planFeatures}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={styles.planFeature}>
                      <span style={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
                  style={plan.popular ? styles.pricingButtonPopular : styles.pricingButton}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaGlow}></div>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Product Listings?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of Shopify merchants using InkBot to create
            compelling product descriptions that convert.
          </p>
          <button
            onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
            style={styles.ctaButtonLarge}
          >
            Install InkBot Free
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <p style={styles.ctaNote}>Free plan includes 10 generations/month. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerTop}>
            <div style={styles.footerBrand}>
              <div style={styles.logo}>
                <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
                <span style={styles.logoText}>InkBot</span>
              </div>
              <p style={styles.footerTagline}>
                AI-powered product descriptions for Shopify merchants.
                <br />
                Available on Shopify App Store.
              </p>
            </div>
            <div style={styles.footerLinks}>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Product</h4>
                <a href="#features" onClick={(e) => handleNavClick(e, "features")} style={styles.footerLink}>Features</a>
                <a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} style={styles.footerLink}>Pricing</a>
                <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} style={styles.footerLink}>How It Works</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Legal</h4>
                <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
                <a href="/terms" style={styles.footerLink}>Terms of Service</a>
              </div>
              <div style={styles.footerColumn}>
                <h4 style={styles.footerHeading}>Install</h4>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleExternalLink("https://apps.shopify.com/inkbot"); }}
                  style={styles.footerLink}
                >
                  Shopify App Store
                </a>
              </div>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>© 2025 InkBot. All rights reserved.</p>
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

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .feature-card {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .feature-card:hover {
    transform: translateY(-8px) !important;
    border-color: rgba(139, 92, 246, 0.5) !important;
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2) !important;
  }
`;

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  // Navigation
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
    transition: "color 0.2s",
    cursor: "pointer",
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
    transition: "all 0.2s",
  },

  // Hero Section
  hero: {
    position: "relative" as const,
    minHeight: "100vh",
    padding: "120px 24px 80px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute" as const,
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "800px",
    height: "800px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  heroGlow2: {
    position: "absolute" as const,
    top: "30%",
    right: "10%",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  heroContent: {
    textAlign: "center" as const,
    maxWidth: "800px",
    zIndex: 1,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "rgba(139, 92, 246, 0.1)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    borderRadius: "100px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#a78bfa",
    marginBottom: "24px",
  },
  badgeDot: {
    width: "6px",
    height: "6px",
    background: "#22c55e",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  heroTitle: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "24px",
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
    marginBottom: "40px",
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
    marginBottom: "48px",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 32px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  heroStats: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "32px",
    flexWrap: "wrap" as const,
  },
  stat: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: "13px",
    color: "#71717a",
    marginTop: "4px",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  shopifyBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginTop: "40px",
    padding: "16px 24px",
    background: "rgba(149, 191, 71, 0.1)",
    border: "1px solid rgba(149, 191, 71, 0.3)",
    borderRadius: "12px",
  },
  shopifyBadgeText: {
    fontSize: "14px",
    color: "#95BF47",
    fontWeight: "500",
  },

  // App Preview
  appPreview: {
    marginTop: "48px",
    width: "100%",
    maxWidth: "900px",
    zIndex: 1,
  },
  appWindow: {
    background: "rgba(26, 26, 46, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    boxShadow: "0 40px 80px rgba(0, 0, 0, 0.5)",
  },
  appWindowHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "rgba(0, 0, 0, 0.3)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  windowDots: {
    display: "flex",
    gap: "6px",
  },
  windowDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  windowTitle: {
    fontSize: "12px",
    color: "#71717a",
  },
  appWindowContent: {
    padding: "24px",
  },
  mockForm: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  mockInput: {
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  mockSelect: {
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  mockLabel: {
    display: "block",
    fontSize: "11px",
    color: "#71717a",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  mockValue: {
    fontSize: "14px",
    color: "#ffffff",
  },
  mockResult: {
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
  },
  mockResultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#a78bfa",
  },
  seoScore: {
    background: "rgba(34, 197, 94, 0.2)",
    color: "#22c55e",
    padding: "4px 12px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "600",
  },
  mockDescription: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#d4d4d8",
  },

  // Features Section
  features: {
    padding: "120px 24px",
    background: "rgba(0, 0, 0, 0.3)",
  },
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    textAlign: "center" as const,
    marginBottom: "64px",
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
  sectionTitle: {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#ffffff",
  },
  sectionSubtitle: {
    fontSize: "18px",
    color: "#a1a1aa",
    maxWidth: "600px",
    margin: "0 auto",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    background: "rgba(26, 26, 46, 0.5)",
    borderRadius: "16px",
    padding: "32px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s ease",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#ffffff",
  },
  featureDescription: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#a1a1aa",
  },

  // How It Works
  howItWorks: {
    padding: "120px 24px",
  },
  stepsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap" as const,
  },
  stepCard: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    textAlign: "center" as const,
    maxWidth: "300px",
    position: "relative" as const,
  },
  stepNumber: {
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    borderRadius: "16px",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  stepContent: {},
  stepTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#ffffff",
  },
  stepDescription: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#a1a1aa",
  },
  stepArrow: {
    position: "absolute" as const,
    right: "-40px",
    top: "20px",
    fontSize: "24px",
    color: "#3f3f46",
  },

  // Pricing
  pricing: {
    padding: "120px 24px",
    background: "rgba(0, 0, 0, 0.3)",
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  pricingCard: {
    background: "rgba(26, 26, 46, 0.5)",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    position: "relative" as const,
    transition: "all 0.3s",
  },
  pricingCardPopular: {
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)",
    border: "1px solid rgba(139, 92, 246, 0.5)",
    transform: "scale(1.02)",
  },
  popularBadge: {
    position: "absolute" as const,
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#ffffff",
  },
  planName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "8px",
  },
  planPrice: {
    marginBottom: "8px",
  },
  priceAmount: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#ffffff",
  },
  pricePeriod: {
    fontSize: "16px",
    color: "#71717a",
  },
  planDescription: {
    fontSize: "14px",
    color: "#a1a1aa",
    marginBottom: "24px",
  },
  planFeatures: {
    listStyle: "none",
    marginBottom: "24px",
  },
  planFeature: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#d4d4d8",
    marginBottom: "12px",
  },
  checkIcon: {
    color: "#22c55e",
    fontWeight: "bold",
  },
  pricingButton: {
    width: "100%",
    padding: "14px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  pricingButtonPopular: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
  },

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
    transition: "all 0.3s",
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
    transition: "color 0.2s",
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
