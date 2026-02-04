import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service — InkBot" },
    { name: "description", content: "Terms of Service for InkBot — AI Product Descriptions & SEO Shopify App" },
  ];
};

export default function TermsOfService() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank");
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
            maxHeight: mobileMenuOpen ? "200px" : "0",
            opacity: mobileMenuOpen ? 1 : 0,
            padding: mobileMenuOpen ? "20px 24px" : "0 24px",
          }}
          className="mobile-menu"
        >
          <a href="/landing" style={styles.mobileNavLink}>Home</a>
          <a href="/privacy" style={styles.mobileNavLink}>Privacy</a>
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
            <h1 style={styles.title}>Terms of Service</h1>
            <p style={styles.subtitle}>InkBot — AI Product Descriptions & SEO</p>
            <p style={styles.date}>Last updated: February 4, 2025</p>
          </header>

          <div style={styles.content}>
            <Section title="1. Acceptance of Terms">
              <p>
                By installing, accessing, or using InkBot ("the App," "we," "our," or "us"),
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, do not install or use the App.
              </p>
              <p>
                These Terms apply to all users of the App, including merchants who install the
                App on their Shopify stores.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                InkBot is a Shopify application that provides AI-powered product description
                generation with SEO optimization. Our services include:
              </p>
              <ul style={styles.list}>
                <li>Single product description generation</li>
                <li>Bulk product description generation</li>
                <li>SEO meta tags and keyword suggestions</li>
                <li>Brand voice customization</li>
                <li>Generation history and analytics</li>
                <li>API access for eligible plans</li>
              </ul>
            </Section>

            <Section title="3. Account and Registration">
              <p>
                To use InkBot, you must have a valid Shopify store and install the App through
                the Shopify App Store or direct installation link. By installing the App, you:
              </p>
              <ul style={styles.list}>
                <li>Confirm you are authorized to act on behalf of the Shopify store</li>
                <li>Grant us access to required store data as described in our Privacy Policy</li>
                <li>Agree to maintain the security of your Shopify account</li>
              </ul>
            </Section>

            <Section title="4. Subscription Plans and Billing">
              <h3 style={styles.subheading}>4.1 Available Plans</h3>
              <p>We offer the following subscription plans:</p>
              <ul style={styles.list}>
                <li><strong>Free:</strong> 100 generations per month, $0/month</li>
                <li><strong>Starter:</strong> 1,000 generations per month, $9/month</li>
                <li><strong>Pro:</strong> 10,000 generations per month, $19/month</li>
                <li><strong>Elite:</strong> 100,000 generations per month, $99/month (includes API access)</li>
              </ul>

              <h3 style={styles.subheading}>4.2 Billing</h3>
              <p>
                All billing is processed through Shopify's Billing API. Charges appear on your
                Shopify invoice. Subscriptions renew automatically each month unless cancelled.
              </p>

              <h3 style={styles.subheading}>4.3 Usage Limits</h3>
              <p>
                Generation counts reset on the first day of each billing cycle. Unused generations
                do not roll over to the next month.
              </p>

              <h3 style={styles.subheading}>4.4 Upgrades and Downgrades</h3>
              <p>
                You may upgrade or downgrade your plan at any time. Changes take effect immediately.
                Downgrading may result in loss of features (e.g., API access is revoked when
                downgrading from Elite).
              </p>
            </Section>

            <Section title="5. Acceptable Use">
              <p>You agree not to use InkBot to:</p>
              <ul style={styles.list}>
                <li>Generate content that is illegal, harmful, or violates third-party rights</li>
                <li>Create misleading, false, or deceptive product descriptions</li>
                <li>Attempt to circumvent usage limits or billing systems</li>
                <li>Reverse engineer, decompile, or extract source code from the App</li>
                <li>Use automated tools to abuse the service or API</li>
                <li>Share API keys with unauthorized parties</li>
                <li>Resell or redistribute generated content as a competing service</li>
              </ul>
            </Section>

            <Section title="6. Intellectual Property">
              <h3 style={styles.subheading}>6.1 Our Intellectual Property</h3>
              <p>
                InkBot, including its design, features, and technology, is owned by us and
                protected by intellectual property laws. You may not copy, modify, or distribute
                any part of the App without our written permission.
              </p>

              <h3 style={styles.subheading}>6.2 Generated Content</h3>
              <p>
                You retain ownership of all content generated through InkBot for your products.
                You are responsible for reviewing and editing generated content before use.
                We make no claims of ownership over your generated descriptions.
              </p>

              <h3 style={styles.subheading}>6.3 Your Content</h3>
              <p>
                You retain ownership of all product information, brand voice settings, and other
                content you provide to InkBot. By using the App, you grant us a limited license
                to process this content solely for providing our services.
              </p>
            </Section>

            <Section title="7. AI-Generated Content Disclaimer">
              <p>
                InkBot uses artificial intelligence to generate product descriptions. You
                acknowledge and agree that:
              </p>
              <ul style={styles.list}>
                <li>AI-generated content may contain errors, inaccuracies, or inappropriate content</li>
                <li>You are solely responsible for reviewing and approving all generated content before use</li>
                <li>We do not guarantee that generated content will improve sales or SEO rankings</li>
                <li>Generated content should be used as a starting point and may require editing</li>
              </ul>
            </Section>

            <Section title="8. Service Availability">
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted service.
                The App may be temporarily unavailable due to:
              </p>
              <ul style={styles.list}>
                <li>Scheduled maintenance</li>
                <li>Third-party service outages (AI providers, hosting, Shopify)</li>
                <li>Technical issues or emergencies</li>
              </ul>
              <p>We will make reasonable efforts to notify users of planned maintenance.</p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <ul style={styles.list}>
                <li>InkBot is provided "AS IS" without warranties of any kind, express or implied</li>
                <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Our total liability shall not exceed the amount you paid for the App in the 12 months preceding the claim</li>
                <li>We are not responsible for any business losses, lost profits, or lost data</li>
              </ul>
            </Section>

            <Section title="10. Indemnification">
              <p>
                You agree to indemnify and hold harmless InkBot, its owners, employees, and
                affiliates from any claims, damages, or expenses arising from:
              </p>
              <ul style={styles.list}>
                <li>Your use of the App</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you generate or publish using the App</li>
              </ul>
            </Section>

            <Section title="11. Termination">
              <h3 style={styles.subheading}>11.1 By You</h3>
              <p>
                You may terminate your use of InkBot at any time by uninstalling the App from
                your Shopify store. No refunds are provided for partial billing periods.
              </p>

              <h3 style={styles.subheading}>11.2 By Us</h3>
              <p>
                We may suspend or terminate your access to InkBot if you violate these Terms,
                engage in fraudulent activity, or for any other reason at our discretion.
              </p>

              <h3 style={styles.subheading}>11.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the App ceases immediately. Your data will
                be deleted in accordance with our Privacy Policy.
              </p>
            </Section>

            <Section title="12. Changes to Terms">
              <p>
                We may modify these Terms at any time. We will notify you of significant changes
                by posting the updated Terms and updating the "Last updated" date. Continued use
                of the App after changes constitutes acceptance of the new Terms.
              </p>
            </Section>

            <Section title="13. Governing Law">
              <p>
                These Terms are governed by the laws of the jurisdiction in which the App
                operator is located, without regard to conflict of law principles.
              </p>
            </Section>

            <Section title="14. Dispute Resolution">
              <p>
                Any disputes arising from these Terms or your use of InkBot shall first be
                attempted to be resolved through good-faith negotiation. If negotiation fails,
                disputes will be resolved through binding arbitration or in the courts of
                competent jurisdiction.
              </p>
            </Section>

            <Section title="15. Contact Information">
              <p>For questions about these Terms, please contact us:</p>
              <ul style={styles.list}>
                <li><strong>Email:</strong> starbowshine@gmail.com</li>
                <li><strong>Support:</strong> Use the in-app Support page</li>
              </ul>
            </Section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p style={styles.copyright}>© 2026 InkBot. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/landing" style={styles.footerLink}>Home</a>
            <a href="/privacy" style={styles.footerLink}>Privacy</a>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>{title}</h2>
      {children}
    </section>
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

  section p {
    font-size: 15px;
    line-height: 1.7;
    color: #d4d4d8;
    margin-bottom: 12px;
  }

  section li {
    font-size: 15px;
    line-height: 1.8;
    color: #d4d4d8;
    padding-left: 20px;
    position: relative;
    margin-bottom: 8px;
  }

  section li::before {
    content: "•";
    color: #8b5cf6;
    position: absolute;
    left: 0;
  }

  section strong {
    color: #ffffff;
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
    marginBottom: "8px",
  },
  date: {
    fontSize: "14px",
    color: "#71717a",
  },
  content: {},
  section: {
    marginBottom: "40px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid rgba(139, 92, 246, 0.3)",
  },
  subheading: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#a78bfa",
    marginTop: "20px",
    marginBottom: "8px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0",
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
