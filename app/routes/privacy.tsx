import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy — InkBot" },
    { name: "description", content: "Privacy Policy for InkBot — AI Product Descriptions & SEO Shopify App" },
  ];
};

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.subtitle}>InkBot — AI Product Descriptions & SEO</p>
          <p style={styles.date}>Last updated: February 4, 2025</p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Introduction</h2>
          <p style={styles.paragraph}>
            Welcome to InkBot ("we," "our," or "us"). We are committed to protecting your privacy
            and ensuring the security of your data. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our Shopify application.
          </p>
          <p style={styles.paragraph}>
            By installing and using InkBot, you agree to the collection and use of information
            in accordance with this policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Information We Collect</h2>

          <h3 style={styles.subheading}>2.1 Store Information</h3>
          <p style={styles.paragraph}>When you install InkBot, we collect:</p>
          <ul style={styles.list}>
            <li>Your Shopify store domain (e.g., your-store.myshopify.com)</li>
            <li>Store owner email address</li>
            <li>Store name and basic store information</li>
          </ul>

          <h3 style={styles.subheading}>2.2 Product Information</h3>
          <p style={styles.paragraph}>To generate product descriptions, we access:</p>
          <ul style={styles.list}>
            <li>Product titles and names</li>
            <li>Product types and categories</li>
            <li>Product features and attributes you provide</li>
            <li>Existing product descriptions (when applying generated content)</li>
          </ul>

          <h3 style={styles.subheading}>2.3 Usage Data</h3>
          <p style={styles.paragraph}>We automatically collect:</p>
          <ul style={styles.list}>
            <li>Number of descriptions generated</li>
            <li>Generation history and timestamps</li>
            <li>Selected niches, tones, and languages</li>
            <li>SEO scores of generated content</li>
          </ul>

          <h3 style={styles.subheading}>2.4 Brand Voice Settings</h3>
          <p style={styles.paragraph}>If you configure brand voice settings, we store:</p>
          <ul style={styles.list}>
            <li>Preferred tone and writing style</li>
            <li>Target audience information</li>
            <li>Keywords to include or avoid</li>
            <li>Brand values and custom prompts</li>
            <li>Sample texts for voice analysis</li>
          </ul>

          <h3 style={styles.subheading}>2.5 Support Communications</h3>
          <p style={styles.paragraph}>When you contact support, we collect:</p>
          <ul style={styles.list}>
            <li>Your email address</li>
            <li>Support ticket content and subject</li>
            <li>Any attachments or additional information you provide</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. How We Use Your Information</h2>
          <p style={styles.paragraph}>We use the collected information to:</p>
          <ul style={styles.list}>
            <li><strong>Provide our services:</strong> Generate AI-powered product descriptions and SEO content</li>
            <li><strong>Improve our app:</strong> Analyze usage patterns to enhance features and user experience</li>
            <li><strong>Process payments:</strong> Manage subscriptions and billing through Shopify's Billing API</li>
            <li><strong>Communicate with you:</strong> Respond to support requests and send important updates</li>
            <li><strong>Ensure security:</strong> Detect and prevent fraud or unauthorized access</li>
            <li><strong>Comply with legal obligations:</strong> Meet regulatory and legal requirements</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Third-Party Services</h2>
          <p style={styles.paragraph}>We use the following third-party services to operate InkBot:</p>

          <h3 style={styles.subheading}>4.1 AI Processing (OpenRouter / DeepSeek)</h3>
          <p style={styles.paragraph}>
            Product information you provide is sent to AI services for description generation.
            This data is processed in accordance with their privacy policies and is not stored
            by these services beyond the generation request.
          </p>

          <h3 style={styles.subheading}>4.2 Database (Neon PostgreSQL)</h3>
          <p style={styles.paragraph}>
            Your data is securely stored in Neon's serverless PostgreSQL database with encryption
            at rest and in transit.
          </p>

          <h3 style={styles.subheading}>4.3 Hosting (Vercel)</h3>
          <p style={styles.paragraph}>
            Our application is hosted on Vercel's secure infrastructure with automatic HTTPS
            and DDoS protection.
          </p>

          <h3 style={styles.subheading}>4.4 Email (Resend)</h3>
          <p style={styles.paragraph}>
            Support ticket notifications are sent via Resend's email service.
          </p>

          <h3 style={styles.subheading}>4.5 Payments (Shopify Billing API)</h3>
          <p style={styles.paragraph}>
            All payment processing is handled directly by Shopify. We do not store any payment
            card information.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Data Retention</h2>
          <p style={styles.paragraph}>We retain your data as follows:</p>
          <ul style={styles.list}>
            <li><strong>Account data:</strong> Retained while your app is installed, deleted within 30 days of uninstallation</li>
            <li><strong>Generation history:</strong> Retained for 12 months for your reference</li>
            <li><strong>Support tickets:</strong> Retained for 24 months for quality assurance</li>
            <li><strong>Usage statistics:</strong> Aggregated and anonymized data may be retained indefinitely</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Data Security</h2>
          <p style={styles.paragraph}>We implement industry-standard security measures including:</p>
          <ul style={styles.list}>
            <li>HTTPS/TLS encryption for all data in transit</li>
            <li>Encryption at rest for stored data</li>
            <li>Secure OAuth 2.0 authentication via Shopify</li>
            <li>API key hashing using SHA-256</li>
            <li>Regular security audits and updates</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Your Rights</h2>
          <p style={styles.paragraph}>You have the right to:</p>
          <ul style={styles.list}>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data (uninstalling the app will trigger automatic deletion)</li>
            <li><strong>Data portability:</strong> Request your data in a machine-readable format</li>
            <li><strong>Withdraw consent:</strong> Uninstall the app at any time to stop data collection</li>
          </ul>
          <p style={styles.paragraph}>
            To exercise these rights, please contact us at the email address below.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Children's Privacy</h2>
          <p style={styles.paragraph}>
            InkBot is not intended for use by children under the age of 18. We do not knowingly
            collect personal information from children. If you believe we have collected data
            from a child, please contact us immediately.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. International Data Transfers</h2>
          <p style={styles.paragraph}>
            Your data may be processed in countries other than your own. We ensure appropriate
            safeguards are in place for international transfers, including standard contractual
            clauses where required.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Changes to This Policy</h2>
          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any
            significant changes by posting the new policy on this page and updating the
            "Last updated" date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. Contact Us</h2>
          <p style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <ul style={styles.list}>
            <li><strong>Email:</strong> starbowshine@gmail.com</li>
            <li><strong>Support:</strong> Use the in-app Support page</li>
          </ul>
        </section>

        <footer style={styles.footer}>
          <p>&copy; 2025 InkBot. All rights reserved.</p>
          <p>
            <a href="/" style={styles.link}>Back to InkBot</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f6f6f7",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "48px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e1e3e5",
  },
  title: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#202223",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6d7175",
    margin: "0 0 8px 0",
  },
  date: {
    fontSize: "14px",
    color: "#8c9196",
    margin: "0",
  },
  section: {
    marginBottom: "32px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#202223",
    margin: "0 0 16px 0",
  },
  subheading: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#202223",
    margin: "16px 0 8px 0",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#202223",
    margin: "0 0 12px 0",
  },
  list: {
    fontSize: "15px",
    lineHeight: "1.8",
    color: "#202223",
    margin: "0 0 12px 0",
    paddingLeft: "24px",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "40px",
    paddingTop: "24px",
    borderTop: "1px solid #e1e3e5",
    color: "#6d7175",
    fontSize: "14px",
  },
  link: {
    color: "#008060",
    textDecoration: "none",
  },
};
