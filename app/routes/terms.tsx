import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service — InkBot" },
    { name: "description", content: "Terms of Service for InkBot — AI Product Descriptions & SEO Shopify App" },
  ];
};

export default function TermsOfService() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>Terms of Service</h1>
          <p style={styles.subtitle}>InkBot — AI Product Descriptions & SEO</p>
          <p style={styles.date}>Last updated: February 4, 2025</p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Acceptance of Terms</h2>
          <p style={styles.paragraph}>
            By installing, accessing, or using InkBot ("the App," "we," "our," or "us"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree
            to these Terms, do not install or use the App.
          </p>
          <p style={styles.paragraph}>
            These Terms apply to all users of the App, including merchants who install the
            App on their Shopify stores.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Description of Service</h2>
          <p style={styles.paragraph}>
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
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. Account and Registration</h2>
          <p style={styles.paragraph}>
            To use InkBot, you must have a valid Shopify store and install the App through
            the Shopify App Store or direct installation link. By installing the App, you:
          </p>
          <ul style={styles.list}>
            <li>Confirm you are authorized to act on behalf of the Shopify store</li>
            <li>Grant us access to required store data as described in our Privacy Policy</li>
            <li>Agree to maintain the security of your Shopify account</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Subscription Plans and Billing</h2>

          <h3 style={styles.subheading}>4.1 Available Plans</h3>
          <p style={styles.paragraph}>We offer the following subscription plans:</p>
          <ul style={styles.list}>
            <li><strong>Free:</strong> 10 generations per month, $0/month</li>
            <li><strong>Starter:</strong> 100 generations per month, $9/month</li>
            <li><strong>Pro:</strong> 500 generations per month, $19/month</li>
            <li><strong>Elite:</strong> 5,000 generations per month, $49/month (includes API access)</li>
          </ul>

          <h3 style={styles.subheading}>4.2 Billing</h3>
          <p style={styles.paragraph}>
            All billing is processed through Shopify's Billing API. Charges appear on your
            Shopify invoice. Subscriptions renew automatically each month unless cancelled.
          </p>

          <h3 style={styles.subheading}>4.3 Usage Limits</h3>
          <p style={styles.paragraph}>
            Generation counts reset on the first day of each billing cycle. Unused generations
            do not roll over to the next month.
          </p>

          <h3 style={styles.subheading}>4.4 Upgrades and Downgrades</h3>
          <p style={styles.paragraph}>
            You may upgrade or downgrade your plan at any time. Changes take effect immediately.
            Downgrading may result in loss of features (e.g., API access is revoked when
            downgrading from Elite).
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Acceptable Use</h2>
          <p style={styles.paragraph}>You agree not to use InkBot to:</p>
          <ul style={styles.list}>
            <li>Generate content that is illegal, harmful, or violates third-party rights</li>
            <li>Create misleading, false, or deceptive product descriptions</li>
            <li>Attempt to circumvent usage limits or billing systems</li>
            <li>Reverse engineer, decompile, or extract source code from the App</li>
            <li>Use automated tools to abuse the service or API</li>
            <li>Share API keys with unauthorized parties</li>
            <li>Resell or redistribute generated content as a competing service</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Intellectual Property</h2>

          <h3 style={styles.subheading}>6.1 Our Intellectual Property</h3>
          <p style={styles.paragraph}>
            InkBot, including its design, features, and technology, is owned by us and
            protected by intellectual property laws. You may not copy, modify, or distribute
            any part of the App without our written permission.
          </p>

          <h3 style={styles.subheading}>6.2 Generated Content</h3>
          <p style={styles.paragraph}>
            You retain ownership of all content generated through InkBot for your products.
            You are responsible for reviewing and editing generated content before use.
            We make no claims of ownership over your generated descriptions.
          </p>

          <h3 style={styles.subheading}>6.3 Your Content</h3>
          <p style={styles.paragraph}>
            You retain ownership of all product information, brand voice settings, and other
            content you provide to InkBot. By using the App, you grant us a limited license
            to process this content solely for providing our services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. AI-Generated Content Disclaimer</h2>
          <p style={styles.paragraph}>
            InkBot uses artificial intelligence to generate product descriptions. You
            acknowledge and agree that:
          </p>
          <ul style={styles.list}>
            <li>AI-generated content may contain errors, inaccuracies, or inappropriate content</li>
            <li>You are solely responsible for reviewing and approving all generated content before use</li>
            <li>We do not guarantee that generated content will improve sales or SEO rankings</li>
            <li>Generated content should be used as a starting point and may require editing</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Service Availability</h2>
          <p style={styles.paragraph}>
            We strive to maintain high availability but do not guarantee uninterrupted service.
            The App may be temporarily unavailable due to:
          </p>
          <ul style={styles.list}>
            <li>Scheduled maintenance</li>
            <li>Third-party service outages (AI providers, hosting, Shopify)</li>
            <li>Technical issues or emergencies</li>
          </ul>
          <p style={styles.paragraph}>
            We will make reasonable efforts to notify users of planned maintenance.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul style={styles.list}>
            <li>
              InkBot is provided "AS IS" without warranties of any kind, express or implied
            </li>
            <li>
              We are not liable for any indirect, incidental, special, consequential, or
              punitive damages
            </li>
            <li>
              Our total liability shall not exceed the amount you paid for the App in the
              12 months preceding the claim
            </li>
            <li>
              We are not responsible for any business losses, lost profits, or lost data
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>10. Indemnification</h2>
          <p style={styles.paragraph}>
            You agree to indemnify and hold harmless InkBot, its owners, employees, and
            affiliates from any claims, damages, or expenses arising from:
          </p>
          <ul style={styles.list}>
            <li>Your use of the App</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Content you generate or publish using the App</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>11. Termination</h2>

          <h3 style={styles.subheading}>11.1 By You</h3>
          <p style={styles.paragraph}>
            You may terminate your use of InkBot at any time by uninstalling the App from
            your Shopify store. No refunds are provided for partial billing periods.
          </p>

          <h3 style={styles.subheading}>11.2 By Us</h3>
          <p style={styles.paragraph}>
            We may suspend or terminate your access to InkBot if you violate these Terms,
            engage in fraudulent activity, or for any other reason at our discretion.
          </p>

          <h3 style={styles.subheading}>11.3 Effect of Termination</h3>
          <p style={styles.paragraph}>
            Upon termination, your right to use the App ceases immediately. Your data will
            be deleted in accordance with our Privacy Policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>12. Changes to Terms</h2>
          <p style={styles.paragraph}>
            We may modify these Terms at any time. We will notify you of significant changes
            by posting the updated Terms and updating the "Last updated" date. Continued use
            of the App after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>13. Governing Law</h2>
          <p style={styles.paragraph}>
            These Terms are governed by the laws of the jurisdiction in which the App
            operator is located, without regard to conflict of law principles.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>14. Dispute Resolution</h2>
          <p style={styles.paragraph}>
            Any disputes arising from these Terms or your use of InkBot shall first be
            attempted to be resolved through good-faith negotiation. If negotiation fails,
            disputes will be resolved through binding arbitration or in the courts of
            competent jurisdiction.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>15. Contact Information</h2>
          <p style={styles.paragraph}>
            For questions about these Terms, please contact us:
          </p>
          <ul style={styles.list}>
            <li><strong>Email:</strong> starbowshine@gmail.com</li>
            <li><strong>Support:</strong> Use the in-app Support page</li>
          </ul>
        </section>

        <footer style={styles.footer}>
          <p>&copy; 2025 InkBot. All rights reserved.</p>
          <p style={styles.links}>
            <a href="/privacy" style={styles.link}>Privacy Policy</a>
            {" • "}
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
  links: {
    marginTop: "8px",
  },
  link: {
    color: "#008060",
    textDecoration: "none",
  },
};
