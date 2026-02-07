import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "InkBot — AI Product Descriptions & SEO for Shopify | Generate in Seconds" },
    { name: "description", content: "Generate unique, SEO-optimized product descriptions for your Shopify store with AI. 9 niches, 111 languages, instant results. Try free today!" },
    { name: "keywords", content: "AI product descriptions, Shopify app, SEO optimization, product copywriting, ecommerce AI, bulk descriptions, Shopify SEO" },
    { property: "og:title", content: "InkBot — AI Product Descriptions & SEO for Shopify" },
    { property: "og:description", content: "Generate unique, SEO-optimized product descriptions 10x faster. Trusted by Shopify merchants worldwide." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://inkbot.app" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div style={styles.logo} className="logo">
            <img src="/favicon.png" alt="InkBot" style={styles.logoImage} />
            <span style={styles.logoText}>InkBot</span>
          </div>

          {/* Desktop Navigation */}
          <div style={styles.navLinks} className="nav-links-desktop">
            <a href="#features" onClick={(e) => handleNavClick(e, "features")} style={styles.navLink} className="nav-link">Features</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} style={styles.navLink} className="nav-link">How It Works</a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} style={styles.navLink} className="nav-link">Pricing</a>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.ctaButton}
              className="cta-btn"
            >
              Start Free
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
            maxHeight: mobileMenuOpen ? "300px" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            padding: mobileMenuOpen ? "20px 24px" : "0 24px",
          }}
          className="mobile-menu"
        >
          <a
            href="#features"
            onClick={(e) => { handleNavClick(e, "features"); setMobileMenuOpen(false); }}
            style={styles.mobileNavLink}
            className="mobile-nav-link"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => { handleNavClick(e, "how-it-works"); setMobileMenuOpen(false); }}
            style={styles.mobileNavLink}
            className="mobile-nav-link"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={(e) => { handleNavClick(e, "pricing"); setMobileMenuOpen(false); }}
            style={styles.mobileNavLink}
            className="mobile-nav-link"
          >
            Pricing
          </a>
          <button
            onClick={() => { handleExternalLink("https://apps.shopify.com/inkbot"); setMobileMenuOpen(false); }}
            style={styles.mobileCtaButton}
            className="cta-btn"
          >
            Start Free
          </button>
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
          <div style={styles.badge} className="badge">
            <svg width="20" height="23" viewBox="0 0 256 292" fill="none">
              <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-.593-6.32-.19-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.826 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-10.051-9.14c1.467 0 2.949.49 4.404 1.469-12.04 5.655-24.942 19.88-30.447 48.39l-22.94 7.105c6.377-21.642 21.456-56.964 48.983-56.964z" fill="#95BF47"/>
              <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.637-1.496-.96-2.394-1.072l-12.527 255.158 89.762-19.42s-31.986-217.36-32.186-218.819c-.201-1.458-1.48-2.266-2.063-3.005z" fill="#5E8E3E"/>
              <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338z" fill="#fff"/>
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
            Built for Shopify. 111 languages. 9 niches. Instant results.
          </p>
          <div style={styles.heroButtons}>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.primaryButton}
              className="btn-primary"
            >
              <span>Try Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => handleNavClick({ preventDefault: () => {} } as any, "how-it-works")}
              style={styles.secondaryButton}
              className="btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>See How It Works</span>
            </button>
          </div>
          <div style={styles.heroStats} className="hero-stats">
            <div style={styles.stat} className="stat">
              <span style={styles.statNumber} className="stat-number">10K+</span>
              <span style={styles.statLabel}>Descriptions Generated</span>
            </div>
            <div style={styles.statDivider} className="stat-divider"></div>
            <div style={styles.stat} className="stat">
              <span style={styles.statNumber} className="stat-number">111</span>
              <span style={styles.statLabel}>Languages</span>
            </div>
            <div style={styles.statDivider} className="stat-divider"></div>
            <div style={styles.stat} className="stat">
              <span style={styles.statNumber} className="stat-number">9</span>
              <span style={styles.statLabel}>Industry Niches</span>
            </div>
          </div>

          {/* Shopify Badge */}
          <div style={styles.shopifyBadge} className="shopify-badge">
            <span style={styles.shopifyBadgeText}>Available on</span>
            <svg width="24" height="28" viewBox="0 0 256 292" fill="none" style={{marginRight: "8px"}}>
              <path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-.593-6.32-.19-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.826 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-10.051-9.14c1.467 0 2.949.49 4.404 1.469-12.04 5.655-24.942 19.88-30.447 48.39l-22.94 7.105c6.377-21.642 21.456-56.964 48.983-56.964z" fill="#95BF47"/>
              <path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.637-1.496-.96-2.394-1.072l-12.527 255.158 89.762-19.42s-31.986-217.36-32.186-218.819c-.201-1.458-1.48-2.266-2.063-3.005z" fill="#5E8E3E"/>
              <path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338z" fill="#fff"/>
            </svg>
            <span style={styles.shopifyBadgeName}>Shopify App Store</span>
          </div>
        </div>

        {/* App Preview */}
        <div style={{
          ...styles.appPreview,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(50px)",
          transition: "all 1s ease-out 0.3s",
        }}>
          <div style={styles.appWindow} className="app-window">
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
                title: "111 Languages",
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
                <div style={styles.featureIcon} className="feature-icon">{feature.icon}</div>
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
              <div key={index} style={styles.stepCard} className="step-card">
                <div style={styles.stepNumber} className="step-number">{item.step}</div>
                <div style={styles.stepContent}>
                  <h3 style={styles.stepTitle}>{item.title}</h3>
                  <p style={styles.stepDescription}>{item.description}</p>
                </div>
                {index < 2 && <div style={styles.stepArrow} className="step-arrow">→</div>}
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
                features: ["100 generations/month", "All 9 niches", "111 languages", "SEO optimization", "Basic support"],
                cta: "Start Free",
                popular: false,
              },
              {
                name: "Starter",
                price: "$9",
                period: "/month",
                description: "For growing stores",
                features: ["1,000 generations/month", "All 9 niches", "111 languages", "SEO optimization", "Brand voice settings", "Email support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/month",
                description: "For active sellers",
                features: ["10,000 generations/month", "All 9 niches", "111 languages", "SEO optimization", "Brand voice settings", "Bulk generation", "Priority support"],
                cta: "Go Pro",
                popular: true,
              },
              {
                name: "Elite",
                price: "$99",
                period: "/month",
                description: "For power users",
                features: ["100,000 generations/month", "All 9 niches", "111 languages", "SEO optimization", "Brand voice settings", "Bulk generation", "API access", "Premium support"],
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
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
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
                  className={plan.popular ? 'pricing-btn-popular' : 'pricing-btn'}
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
                <a href="#features" onClick={(e) => handleNavClick(e, "features")} style={styles.footerLink} className="footer-link">Features</a>
                <a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} style={styles.footerLink} className="footer-link">Pricing</a>
                <a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} style={styles.footerLink} className="footer-link">How It Works</a>
                <a href="/faq" style={styles.footerLink} className="footer-link">FAQ</a>
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
            <p style={styles.copyright}>© 2026 InkBot. All rights reserved.</p>
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
    cursor: pointer;
  }

  .feature-card:hover {
    transform: translateY(-12px) scale(1.02) !important;
    border-color: rgba(139, 92, 246, 0.6) !important;
    box-shadow: 0 25px 50px rgba(139, 92, 246, 0.3) !important;
    background: rgba(139, 92, 246, 0.1) !important;
  }

  .feature-card:hover .feature-icon {
    transform: scale(1.2) rotate(5deg);
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

  /* Buttons */
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

  .btn-primary:active {
    transform: translateY(0) scale(0.98);
  }

  .btn-secondary {
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.1) !important;
    border-color: rgba(139, 92, 246, 0.5) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .btn-secondary:active {
    transform: translateY(0) scale(0.98);
  }

  /* CTA Button */
  .cta-btn {
    transition: all 0.3s ease;
  }

  .cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4) !important;
  }

  /* Pricing cards */
  .pricing-card {
    transition: all 0.4s ease;
    cursor: pointer;
  }

  .pricing-card:hover {
    transform: translateY(-10px) scale(1.03);
    border-color: rgba(139, 92, 246, 0.5) !important;
    box-shadow: 0 30px 60px rgba(139, 92, 246, 0.2) !important;
  }

  .pricing-card.popular:hover {
    transform: translateY(-15px) scale(1.05);
    box-shadow: 0 40px 80px rgba(139, 92, 246, 0.3) !important;
  }

  .pricing-btn {
    transition: all 0.3s ease;
  }

  .pricing-btn:hover {
    transform: scale(1.05);
    background: rgba(139, 92, 246, 0.2) !important;
    border-color: rgba(139, 92, 246, 0.5) !important;
  }

  .pricing-btn-popular {
    transition: all 0.3s ease;
  }

  .pricing-btn-popular:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5) !important;
  }

  /* Step cards */
  .step-card {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .step-card:hover {
    transform: translateY(-8px);
  }

  .step-card:hover .step-number {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
  }

  .step-number {
    transition: all 0.3s ease;
  }

  /* Badge */
  .badge {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .badge:hover {
    transform: scale(1.05);
    border-color: rgba(139, 92, 246, 0.6) !important;
    box-shadow: 0 5px 20px rgba(139, 92, 246, 0.3);
  }

  /* Shopify badge */
  .shopify-badge {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .shopify-badge:hover {
    transform: scale(1.05);
    border-color: rgba(149, 191, 71, 0.6) !important;
    box-shadow: 0 10px 30px rgba(149, 191, 71, 0.2);
  }

  /* Stats */
  .stat {
    transition: all 0.3s ease;
    cursor: default;
  }

  .stat:hover {
    transform: scale(1.1);
  }

  .stat:hover .stat-number {
    color: #a78bfa !important;
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

  /* App window */
  .app-window {
    transition: all 0.5s ease;
  }

  .app-window:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 50px 100px rgba(139, 92, 246, 0.3) !important;
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

  /* Feature icon animation */
  .feature-icon {
    transition: all 0.3s ease;
    display: inline-block;
  }

  /* Glow effect on scroll */
  @keyframes glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Floating animation for hero elements */
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  .hero-glow {
    animation: floatSlow 8s ease-in-out infinite;
  }

  /* Ripple effect */
  @keyframes ripple {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.5); opacity: 0; }
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

    .step-card {
      max-width: 100% !important;
    }

    .pricing-card {
      margin: 0 !important;
    }

    .pricing-card.popular {
      transform: none !important;
    }

    .step-arrow {
      display: none !important;
    }

    .hero-stats {
      gap: 16px !important;
    }

    .stat-divider {
      display: none !important;
    }

    .shopify-badge {
      flex-wrap: wrap;
      justify-content: center;
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

  /* Mobile nav link hover */
  .mobile-nav-link {
    transition: all 0.3s ease;
  }

  .mobile-nav-link:hover {
    color: #a78bfa !important;
    transform: translateX(5px);
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

  // Mobile Menu
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
    color: "#a1a1aa",
    fontWeight: "500",
  },
  shopifyBadgeName: {
    fontSize: "18px",
    color: "#95BF47",
    fontWeight: "600",
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
