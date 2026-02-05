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
          gap: 16px;
          margin-bottom: 40px;
        }

        .logo-image {
          height: 50px;
          width: auto;
        }

        .logo-image-large {
          height: 70px;
          width: auto;
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
          background: #f8f8f8;
          overflow: hidden;
        }

        /* App mockups */
        .app-layout {
          display: flex;
          height: 100%;
        }

        .app-sidebar {
          width: 240px;
          background: #fff;
          border-right: 1px solid #e4e4e7;
          padding: 20px 0;
        }

        .sidebar-logo {
          padding: 0 20px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #e4e4e7;
          margin-bottom: 16px;
        }

        .sidebar-logo-image {
          height: 32px;
          width: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #52525b;
          cursor: pointer;
        }

        .nav-item.active {
          background: #f4f4f5;
          color: #8b5cf6;
          font-weight: 600;
        }

        .nav-icon {
          width: 20px;
          text-align: center;
        }

        .app-main {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .page-title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #18181b;
          margin-bottom: 24px;
        }

        .card {
          background: #fff;
          border: 1px solid #e4e4e7;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .card-title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #18181b;
          margin-bottom: 16px;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-card {
          background: #fafafa;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #8b5cf6;
        }

        .stat-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          color: #71717a;
          margin-top: 4px;
        }

        .progress-bar {
          height: 8px;
          background: #e4e4e7;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%);
          border-radius: 4px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #18181b;
          margin-bottom: 8px;
          display: block;
        }

        .form-input {
          width: 100%;
          height: 40px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
        }

        .form-select {
          width: 100%;
          height: 40px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          background: #fff;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 20px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: #fff;
        }

        .btn-secondary {
          background: #f4f4f5;
          color: #18181b;
        }

        .result-card {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          padding: 24px;
        }

        .result-title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #18181b;
          margin-bottom: 12px;
        }

        .result-description {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #52525b;
          line-height: 1.6;
        }

        .seo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #22c55e;
          color: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          font-weight: 600;
          margin-top: 16px;
        }

        .product-list {
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          overflow: hidden;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #e4e4e7;
        }

        .product-item:last-child {
          border-bottom: none;
        }

        .product-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #8b5cf6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-checkbox.checked {
          background: #8b5cf6;
          color: #fff;
        }

        .product-image {
          width: 48px;
          height: 48px;
          background: #f4f4f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #18181b;
        }

        .product-meta {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          color: #71717a;
        }

        .product-badge {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          font-weight: 500;
        }

        .plan-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .plan-card {
          background: #fff;
          border: 2px solid #e4e4e7;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .plan-card.popular {
          border-color: #8b5cf6;
          position: relative;
        }

        .plan-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #8b5cf6;
          color: #fff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .plan-name {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #18181b;
          margin-bottom: 8px;
        }

        .plan-price {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #8b5cf6;
        }

        .plan-price span {
          font-size: 14px;
          color: #71717a;
          font-weight: 400;
        }

        .plan-features {
          margin: 16px 0;
          text-align: left;
        }

        .plan-feature {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          color: #52525b;
          padding: 6px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .check-icon {
          color: #22c55e;
        }

        .textarea {
          width: 100%;
          min-height: 100px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          resize: none;
        }

        .checkbox-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          color: #52525b;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #8b5cf6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #8b5cf6;
          color: #fff;
          font-size: 12px;
        }

        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .filter-select {
          height: 36px;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          padding: 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          background: #fff;
          min-width: 150px;
        }

        .search-input {
          flex: 1;
          height: 36px;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          padding: 0 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
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
            <img src="/logo.png" alt="InkBot" className="logo-image-large" />
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
              <div className="app-layout">
                <div className="app-sidebar">
                  <div className="sidebar-logo">
                    <img src="/logo.png" alt="InkBot" className="sidebar-logo-image" />
                  </div>
                  <div className="nav-item active"><span className="nav-icon">🏠</span> Dashboard</div>
                  <div className="nav-item"><span className="nav-icon">✨</span> Generate</div>
                  <div className="nav-item"><span className="nav-icon">📦</span> Bulk Generate</div>
                  <div className="nav-item"><span className="nav-icon">📋</span> History</div>
                  <div className="nav-item"><span className="nav-icon">🔑</span> API</div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
                  <div className="nav-item"><span className="nav-icon">💳</span> Billing</div>
                </div>
                <div className="app-main">
                  <div className="page-title">Dashboard</div>
                  <div className="card">
                    <div className="card-title">This Month's Usage</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "14px", color: "#52525b" }}>247 / 1,000 generations</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#8b5cf6" }}>STARTER</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "24.7%" }}></div>
                    </div>
                  </div>
                  <div className="stat-grid">
                    <div className="stat-card">
                      <div className="stat-value">1,284</div>
                      <div className="stat-label">Total Generations</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">87</div>
                      <div className="stat-label">Avg SEO Score</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">892</div>
                      <div className="stat-label">Applied to Store</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">42h</div>
                      <div className="stat-label">Time Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 2: Generate */}
      <div className="screenshot-block">
        <div className="screenshot-number">2 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/logo.png" alt="InkBot" className="logo-image-large" />
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
              <div className="app-layout">
                <div className="app-sidebar">
                  <div className="sidebar-logo">
                    <img src="/logo.png" alt="InkBot" className="sidebar-logo-image" />
                  </div>
                  <div className="nav-item"><span className="nav-icon">🏠</span> Dashboard</div>
                  <div className="nav-item active"><span className="nav-icon">✨</span> Generate</div>
                  <div className="nav-item"><span className="nav-icon">📦</span> Bulk Generate</div>
                  <div className="nav-item"><span className="nav-icon">📋</span> History</div>
                  <div className="nav-item"><span className="nav-icon">🔑</span> API</div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
                  <div className="nav-item"><span className="nav-icon">💳</span> Billing</div>
                </div>
                <div className="app-main">
                  <div className="page-title">Generate Description</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                      <div className="card">
                        <div className="card-title">Product Details</div>
                        <div className="form-group">
                          <label className="form-label">Product</label>
                          <div className="form-select" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🖼️</span> Premium Wireless Headphones
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div className="form-group">
                            <label className="form-label">Niche</label>
                            <div className="form-select">🎧 Electronics</div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Tone</label>
                            <div className="form-select">Professional</div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Generate Options</label>
                          <div className="checkbox-group">
                            <div className="checkbox-item"><div className="checkbox">✓</div> Title</div>
                            <div className="checkbox-item"><div className="checkbox">✓</div> Description</div>
                            <div className="checkbox-item"><div className="checkbox">✓</div> Meta Title</div>
                            <div className="checkbox-item"><div className="checkbox">✓</div> Meta Description</div>
                          </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: "100%" }}>✨ Generate Description</button>
                      </div>
                    </div>
                    <div>
                      <div className="result-card">
                        <div className="result-title">Premium Wireless Headphones Pro</div>
                        <p className="result-description">
                          Experience audio perfection with our Premium Wireless Headphones.
                          Featuring advanced noise cancellation technology and 40-hour battery life,
                          these headphones deliver crystal-clear sound for music lovers and professionals alike.
                          <br /><br />
                          <strong>Key Features:</strong><br />
                          • Active Noise Cancellation<br />
                          • 40-hour battery life<br />
                          • Premium memory foam cushions
                        </p>
                        <div className="seo-badge">✓ SEO Score: 92/100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 3: Bulk Generate */}
      <div className="screenshot-block">
        <div className="screenshot-number">3 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/logo.png" alt="InkBot" className="logo-image-large" />
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
              <div className="app-layout">
                <div className="app-sidebar">
                  <div className="sidebar-logo">
                    <img src="/logo.png" alt="InkBot" className="sidebar-logo-image" />
                  </div>
                  <div className="nav-item"><span className="nav-icon">🏠</span> Dashboard</div>
                  <div className="nav-item"><span className="nav-icon">✨</span> Generate</div>
                  <div className="nav-item active"><span className="nav-icon">📦</span> Bulk Generate</div>
                  <div className="nav-item"><span className="nav-icon">📋</span> History</div>
                  <div className="nav-item"><span className="nav-icon">🔑</span> API</div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
                  <div className="nav-item"><span className="nav-icon">💳</span> Billing</div>
                </div>
                <div className="app-main">
                  <div className="page-title">Bulk Generate</div>
                  <div className="card">
                    <div className="card-title">Select Products</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#8b5cf6" }}>5 products selected</span>
                      <span style={{ fontSize: "13px", color: "#71717a", cursor: "pointer" }}>Clear all</span>
                    </div>
                    <div className="filter-row">
                      <select className="filter-select">
                        <option>All collections</option>
                      </select>
                      <select className="filter-select">
                        <option>Not generated</option>
                      </select>
                      <input type="text" className="search-input" placeholder="🔍 Search products..." />
                    </div>
                    <div className="product-list">
                      <div className="product-item">
                        <div className="product-checkbox checked">✓</div>
                        <div className="product-image">🖼️</div>
                        <div className="product-info">
                          <div className="product-name">Wireless Earbuds Pro</div>
                          <div className="product-meta">Electronics • $149.99</div>
                        </div>
                      </div>
                      <div className="product-item">
                        <div className="product-checkbox checked">✓</div>
                        <div className="product-image">🖼️</div>
                        <div className="product-info">
                          <div className="product-name">Smart Watch Series X</div>
                          <div className="product-meta">Electronics • $299.99</div>
                        </div>
                        <div className="product-badge">Generated</div>
                      </div>
                      <div className="product-item">
                        <div className="product-checkbox checked">✓</div>
                        <div className="product-image">🖼️</div>
                        <div className="product-info">
                          <div className="product-name">Portable Bluetooth Speaker</div>
                          <div className="product-meta">Electronics • $79.99</div>
                        </div>
                      </div>
                      <div className="product-item">
                        <div className="product-checkbox checked">✓</div>
                        <div className="product-image">🖼️</div>
                        <div className="product-info">
                          <div className="product-name">USB-C Charging Hub</div>
                          <div className="product-meta">Electronics • $49.99</div>
                        </div>
                      </div>
                      <div className="product-item">
                        <div className="product-checkbox checked">✓</div>
                        <div className="product-image">🖼️</div>
                        <div className="product-info">
                          <div className="product-name">Mechanical Keyboard RGB</div>
                          <div className="product-meta">Electronics • $129.99</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary">✨ Generate 5 Descriptions</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 4: Brand Voice */}
      <div className="screenshot-block">
        <div className="screenshot-number">4 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/logo.png" alt="InkBot" className="logo-image-large" />
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
              <div className="app-layout">
                <div className="app-sidebar">
                  <div className="sidebar-logo">
                    <img src="/logo.png" alt="InkBot" className="sidebar-logo-image" />
                  </div>
                  <div className="nav-item"><span className="nav-icon">🏠</span> Dashboard</div>
                  <div className="nav-item"><span className="nav-icon">✨</span> Generate</div>
                  <div className="nav-item"><span className="nav-icon">📦</span> Bulk Generate</div>
                  <div className="nav-item"><span className="nav-icon">📋</span> History</div>
                  <div className="nav-item"><span className="nav-icon">🔑</span> API</div>
                  <div className="nav-item active"><span className="nav-icon">⚙️</span> Settings</div>
                  <div className="nav-item"><span className="nav-icon">💳</span> Billing</div>
                </div>
                <div className="app-main">
                  <div className="page-title">Brand Voice Settings</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                      <div className="card">
                        <div className="card-title">Brand Identity</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div className="form-group">
                            <label className="form-label">Tone</label>
                            <div className="form-select">Premium & Sophisticated</div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Style</label>
                            <div className="form-select">Minimalist</div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Target Audience</label>
                          <input type="text" className="form-input" value="Tech-savvy professionals aged 25-45" readOnly />
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-title">Brand Keywords</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: "#f3e8ff", color: "#7c3aed", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>innovative</span>
                          <span style={{ background: "#f3e8ff", color: "#7c3aed", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>premium</span>
                          <span style={{ background: "#f3e8ff", color: "#7c3aed", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>cutting-edge</span>
                          <span style={{ background: "#f3e8ff", color: "#7c3aed", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>sustainable</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="card">
                        <div className="card-title">Custom Prompt</div>
                        <textarea className="textarea" readOnly value="Always emphasize our commitment to sustainability and eco-friendly materials. Highlight the premium craftsmanship and attention to detail in every product."></textarea>
                      </div>
                      <div className="card">
                        <div className="card-title">Words to Avoid</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>cheap</span>
                          <span style={{ background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>basic</span>
                          <span style={{ background: "#fee2e2", color: "#dc2626", padding: "6px 12px", borderRadius: "16px", fontSize: "13px" }}>simple</span>
                        </div>
                      </div>
                      <button className="btn btn-primary" style={{ width: "100%" }}>💾 Save Brand Voice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot 5: Billing */}
      <div className="screenshot-block">
        <div className="screenshot-number">5 / 5</div>
        <div className="left-panel">
          <div className="logo-area">
            <img src="/logo.png" alt="InkBot" className="logo-image-large" />
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
              <div className="app-layout">
                <div className="app-sidebar">
                  <div className="sidebar-logo">
                    <img src="/logo.png" alt="InkBot" className="sidebar-logo-image" />
                  </div>
                  <div className="nav-item"><span className="nav-icon">🏠</span> Dashboard</div>
                  <div className="nav-item"><span className="nav-icon">✨</span> Generate</div>
                  <div className="nav-item"><span className="nav-icon">📦</span> Bulk Generate</div>
                  <div className="nav-item"><span className="nav-icon">📋</span> History</div>
                  <div className="nav-item"><span className="nav-icon">🔑</span> API</div>
                  <div className="nav-item"><span className="nav-icon">⚙️</span> Settings</div>
                  <div className="nav-item active"><span className="nav-icon">💳</span> Billing</div>
                </div>
                <div className="app-main">
                  <div className="page-title">Choose Your Plan</div>
                  <div className="plan-grid">
                    <div className="plan-card">
                      <div className="plan-name">Free</div>
                      <div className="plan-price">$0<span>/mo</span></div>
                      <div className="plan-features">
                        <div className="plan-feature"><span className="check-icon">✓</span> 100 generations/month</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> All 9 niches</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> 42 languages</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> SEO optimization</div>
                      </div>
                      <button className="btn btn-secondary" style={{ width: "100%" }}>Current Plan</button>
                    </div>
                    <div className="plan-card">
                      <div className="plan-name">Starter</div>
                      <div className="plan-price">$9<span>/mo</span></div>
                      <div className="plan-features">
                        <div className="plan-feature"><span className="check-icon">✓</span> 1,000 generations/month</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> All Free features</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> Brand voice</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> Bulk generate</div>
                      </div>
                      <button className="btn btn-primary" style={{ width: "100%" }}>Upgrade</button>
                    </div>
                    <div className="plan-card popular">
                      <div className="plan-badge">POPULAR</div>
                      <div className="plan-name">Pro</div>
                      <div className="plan-price">$19<span>/mo</span></div>
                      <div className="plan-features">
                        <div className="plan-feature"><span className="check-icon">✓</span> 10,000 generations/month</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> All Starter features</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> Priority support</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> Advanced analytics</div>
                      </div>
                      <button className="btn btn-primary" style={{ width: "100%" }}>Upgrade</button>
                    </div>
                    <div className="plan-card">
                      <div className="plan-name">Elite</div>
                      <div className="plan-price">$99<span>/mo</span></div>
                      <div className="plan-features">
                        <div className="plan-feature"><span className="check-icon">✓</span> 100,000 generations/month</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> All Pro features</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> API access</div>
                        <div className="plan-feature"><span className="check-icon">✓</span> Dedicated support</div>
                      </div>
                      <button className="btn btn-primary" style={{ width: "100%" }}>Upgrade</button>
                    </div>
                  </div>
                </div>
              </div>
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
