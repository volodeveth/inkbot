import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "InkBot Screenshots" },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export default function Screenshots() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", padding: "40px" }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .screenshot-block {
          width: 1600px;
          height: 900px;
          margin: 0 auto 60px;
          display: flex;
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }

        .screenshot-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .left-panel {
          width: 500px;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 40px;
        }

        .logo-icon {
          height: 60px;
          width: 60px;
          object-fit: contain;
        }

        .logo-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #fff;
        }

        .headline {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 42px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .headline .highlight {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subheadline {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 20px;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .features-list {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 18px;
          color: #d4d4d8;
        }

        .feature-icon {
          width: 28px;
          height: 28px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          font-size: 16px;
        }

        .right-panel {
          flex: 1;
          padding: 60px 60px 60px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .browser-window {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .browser-header {
          height: 44px;
          min-height: 44px;
          background: #f4f4f5;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
          border-bottom: 1px solid #e4e4e7;
        }

        .browser-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .browser-dot.red { background: #ef4444; }
        .browser-dot.yellow { background: #eab308; }
        .browser-dot.green { background: #22c55e; }

        .browser-url {
          flex: 1;
          margin-left: 16px;
          height: 28px;
          background: #fff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          color: #71717a;
        }

        .browser-content {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: #f1f1f1;
        }

        .browser-content img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: top center;
          display: block;
        }

        .screenshot-number {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
          padding: 8px 16px;
          border-radius: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>

      <h1 style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "32px",
        fontWeight: 700,
        color: "#fff",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        InkBot App Store Screenshots (1600x900px)
      </h1>

      {/* Screenshot 1: Dashboard */}
      <div className="screenshot-block">
        <div className="screenshot-number">1 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/favicon.png" alt="InkBot" className="logo-icon" />
            <span className="logo-text">InkBot</span>
          </div>
          <h2 className="headline">
            Your <span className="highlight">AI Writing</span><br />
            Command Center
          </h2>
          <p className="subheadline">
            Track your progress, manage generations, and monitor SEO performance from one powerful dashboard.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Real-time usage statistics</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Quick generation access</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <span>SEO score tracking</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 inkbot.app/app</div>
            </div>
            <div className="browser-content">
              <img src="/screenshots/dashboard.jpg" alt="InkBot Dashboard" />
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 2: Generate */}
      <div className="screenshot-block">
        <div className="screenshot-number">2 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/favicon.png" alt="InkBot" className="logo-icon" />
            <span className="logo-text">InkBot</span>
          </div>
          <h2 className="headline">
            Generate <span className="highlight">SEO-Optimized</span><br />
            Descriptions in Seconds
          </h2>
          <p className="subheadline">
            Select a product, choose your niche and tone, and get professional descriptions with one click.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>9 specialized niches</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <span>42 languages supported</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <span>One-click apply to Shopify</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 inkbot.app/app/generate</div>
            </div>
            <div className="browser-content">
              <img src="/screenshots/generate.jpg" alt="InkBot Generate" />
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 3: Bulk Generate */}
      <div className="screenshot-block">
        <div className="screenshot-number">3 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/favicon.png" alt="InkBot" className="logo-icon" />
            <span className="logo-text">InkBot</span>
          </div>
          <h2 className="headline">
            Process Your <span className="highlight">Entire Catalog</span><br />
            at Once
          </h2>
          <p className="subheadline">
            Select multiple products, filter by collection, and generate descriptions in bulk. Save hours of writing time.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">📂</div>
              <span>Filter by collection</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <span>Smart product search</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Batch processing</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 inkbot.app/app/bulk</div>
            </div>
            <div className="browser-content">
              <img src="/screenshots/bulk.jpg" alt="InkBot Bulk Generate" />
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 4: Brand Voice */}
      <div className="screenshot-block">
        <div className="screenshot-number">4 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/favicon.png" alt="InkBot" className="logo-icon" />
            <span className="logo-text">InkBot</span>
          </div>
          <h2 className="headline">
            Train AI to Match<br />
            <span className="highlight">Your Brand Voice</span>
          </h2>
          <p className="subheadline">
            Define your brand's unique tone, style, and vocabulary. Every generated description will reflect your identity.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <span>Custom tone & style</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📝</div>
              <span>Brand keywords</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🚫</div>
              <span>Words to avoid</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 inkbot.app/app/settings</div>
            </div>
            <div className="browser-content">
              <img src="/screenshots/brand-voice.jpg" alt="InkBot Brand Voice Settings" />
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 5: Billing */}
      <div className="screenshot-block">
        <div className="screenshot-number">5 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/favicon.png" alt="InkBot" className="logo-icon" />
            <span className="logo-text">InkBot</span>
          </div>
          <h2 className="headline">
            Start Free,<br />
            <span className="highlight">Scale As You Grow</span>
          </h2>
          <p className="subheadline">
            Begin with 100 free generations. Upgrade anytime as your store grows. No contracts, cancel anytime.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">🆓</div>
              <span>100 free generations</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <span>Flexible scaling</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔓</div>
              <span>No lock-in contracts</span>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 inkbot.app/app/billing</div>
            </div>
            <div className="browser-content">
              <img src="/screenshots/billing.jpg" alt="InkBot Billing Plans" />
            </div>
          </div>
        </div>
      </div>

      <p style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "16px",
        color: "#71717a",
        textAlign: "center",
        marginTop: "40px"
      }}>
        Take screenshots of each block at 1600x900px for Shopify App Store submission
      </p>
    </div>
  );
}
