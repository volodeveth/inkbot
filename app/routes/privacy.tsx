import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy — InkBot" },
    { name: "description", content: "Privacy Policy for InkBot — AI Product Descriptions & SEO Shopify App" },
  ];
};

export default function PrivacyPolicy() {
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
          <div style={styles.navLinks}>
            <a href="/landing" style={styles.navLink}>Home</a>
            <a href="/terms" style={styles.navLink}>Terms</a>
            <button
              onClick={() => handleExternalLink("https://apps.shopify.com/inkbot")}
              style={styles.ctaButton}
            >
              Install App
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          <header style={styles.header}>
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.subtitle}>InkBot — AI Product Descriptions & SEO</p>
            <p style={styles.date}>Last updated: February 4, 2025</p>
          </header>

          <div style={styles.content}>
            <Section title="1. Introduction">
              <p>
                Welcome to InkBot ("we," "our," or "us"). We are committed to protecting your privacy
                and ensuring the security of your data. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our Shopify application.
              </p>
              <p>
                By installing and using InkBot, you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <h3 style={styles.subheading}>2.1 Store Information</h3>
              <p>When you install InkBot, we collect:</p>
              <ul style={styles.list}>
                <li>Your Shopify store domain (e.g., your-store.myshopify.com)</li>
                <li>Store owner email address</li>
                <li>Store name and basic store information</li>
              </ul>

              <h3 style={styles.subheading}>2.2 Product Information</h3>
              <p>To generate product descriptions, we access:</p>
              <ul style={styles.list}>
                <li>Product titles and names</li>
                <li>Product types and categories</li>
                <li>Product features and attributes you provide</li>
                <li>Existing product descriptions (when applying generated content)</li>
              </ul>

              <h3 style={styles.subheading}>2.3 Usage Data</h3>
              <p>We automatically collect:</p>
              <ul style={styles.list}>
                <li>Number of descriptions generated</li>
                <li>Generation history and timestamps</li>
                <li>Selected niches, tones, and languages</li>
                <li>SEO scores of generated content</li>
              </ul>

              <h3 style={styles.subheading}>2.4 Brand Voice Settings</h3>
              <p>If you configure brand voice settings, we store:</p>
              <ul style={styles.list}>
                <li>Preferred tone and writing style</li>
                <li>Target audience information</li>
                <li>Keywords to include or avoid</li>
                <li>Brand values and custom prompts</li>
                <li>Sample texts for voice analysis</li>
              </ul>

              <h3 style={styles.subheading}>2.5 Support Communications</h3>
              <p>When you contact support, we collect:</p>
              <ul style={styles.list}>
                <li>Your email address</li>
                <li>Support ticket content and subject</li>
                <li>Any attachments or additional information you provide</li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use the collected information to:</p>
              <ul style={styles.list}>
                <li><strong>Provide our services:</strong> Generate AI-powered product descriptions and SEO content</li>
                <li><strong>Improve our app:</strong> Analyze usage patterns to enhance features and user experience</li>
                <li><strong>Process payments:</strong> Manage subscriptions and billing through Shopify's Billing API</li>
                <li><strong>Communicate with you:</strong> Respond to support requests and send important updates</li>
                <li><strong>Ensure security:</strong> Detect and prevent fraud or unauthorized access</li>
                <li><strong>Comply with legal obligations:</strong> Meet regulatory and legal requirements</li>
              </ul>
            </Section>

            <Section title="4. Third-Party Services">
              <p>We use the following third-party services to operate InkBot:</p>

              <h3 style={styles.subheading}>4.1 AI Processing (OpenRouter / DeepSeek)</h3>
              <p>
                Product information you provide is sent to AI services for description generation.
                This data is processed in accordance with their privacy policies and is not stored
                by these services beyond the generation request.
              </p>

              <h3 style={styles.subheading}>4.2 Database (Neon PostgreSQL)</h3>
              <p>
                Your data is securely stored in Neon's serverless PostgreSQL database with encryption
                at rest and in transit.
              </p>

              <h3 style={styles.subheading}>4.3 Hosting (Vercel)</h3>
              <p>
                Our application is hosted on Vercel's secure infrastructure with automatic HTTPS
                and DDoS protection.
              </p>

              <h3 style={styles.subheading}>4.4 Email (Resend)</h3>
              <p>Support ticket notifications are sent via Resend's email service.</p>

              <h3 style={styles.subheading}>4.5 Payments (Shopify Billing API)</h3>
              <p>
                All payment processing is handled directly by Shopify. We do not store any payment
                card information.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>We retain your data as follows:</p>
              <ul style={styles.list}>
                <li><strong>Account data:</strong> Retained while your app is installed, deleted within 30 days of uninstallation</li>
                <li><strong>Generation history:</strong> Retained for 12 months for your reference</li>
                <li><strong>Support tickets:</strong> Retained for 24 months for quality assurance</li>
                <li><strong>Usage statistics:</strong> Aggregated and anonymized data may be retained indefinitely</li>
              </ul>
            </Section>

            <Section title="6. Data Security">
              <p>We implement industry-standard security measures including:</p>
              <ul style={styles.list}>
                <li>HTTPS/TLS encryption for all data in transit</li>
                <li>Encryption at rest for stored data</li>
                <li>Secure OAuth 2.0 authentication via Shopify</li>
                <li>API key hashing using SHA-256</li>
                <li>Regular security audits and updates</li>
              </ul>
            </Section>

            <Section title="7. Your Rights">
              <p>You have the right to:</p>
              <ul style={styles.list}>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (uninstalling the app will trigger automatic deletion)</li>
                <li><strong>Data portability:</strong> Request your data in a machine-readable format</li>
                <li><strong>Withdraw consent:</strong> Uninstall the app at any time to stop data collection</li>
              </ul>
              <p>To exercise these rights, please contact us at the email address below.</p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                InkBot is not intended for use by children under the age of 18. We do not knowingly
                collect personal information from children. If you believe we have collected data
                from a child, please contact us immediately.
              </p>
            </Section>

            <Section title="9. International Data Transfers">
              <p>
                Your data may be processed in countries other than your own. We ensure appropriate
                safeguards are in place for international transfers, including standard contractual
                clauses where required.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                significant changes by posting the new policy on this page and updating the
                "Last updated" date.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or our data practices,
                please contact us:
              </p>
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
          <p style={styles.copyright}>© 2025 InkBot. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/landing" style={styles.footerLink}>Home</a>
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
