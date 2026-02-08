import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const projectRoot = "D:/Myapps/InkBot";
const outputPath = path.resolve(projectRoot, "інструкції, дизайн, лого, файли/Mobile Screenshot.png");

const faviconB64 = fs.readFileSync(path.resolve(projectRoot, "public/favicon.png")).toString("base64");
const mobile1B64 = fs.readFileSync(path.resolve(projectRoot, "інструкції, дизайн, лого, файли/зображення_viber_2026-02-08_01-02-56-598.jpg")).toString("base64");
const mobile2B64 = fs.readFileSync(path.resolve(projectRoot, "інструкції, дизайн, лого, файли/зображення_viber_2026-02-08_01-02-56-618.jpg")).toString("base64");

const faviconSrc = `data:image/png;base64,${faviconB64}`;
const mobile1Src = `data:image/jpeg;base64,${mobile1B64}`;
const mobile2Src = `data:image/jpeg;base64,${mobile2B64}`;

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

  .screenshot-block {
    width: 1600px; height: 900px;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
    overflow: hidden; position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .screenshot-block::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 35% 30%, rgba(139,92,246,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 65% 70%, rgba(99,102,241,0.08) 0%, transparent 40%);
    pointer-events: none;
  }

  .top-area {
    position: relative; z-index: 1;
    text-align: center; margin-bottom: 40px;
  }
  .logo-area {
    display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px;
  }
  .logo-icon { height: 44px; width: 44px; object-fit: contain; }
  .logo-text { font-size: 28px; font-weight: 700; color: #fff; }

  .headline {
    font-size: 38px; font-weight: 800; color: #fff; line-height: 1.15;
    margin-bottom: 12px; letter-spacing: -0.5px;
  }
  .headline .highlight {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .subheadline {
    font-size: 17px; color: #a1a1aa; line-height: 1.5;
  }

  .phones-area {
    position: relative; z-index: 1;
    display: flex; align-items: flex-start; gap: 60px;
  }

  .phone-wrapper {
    display: flex; flex-direction: column; align-items: center; gap: 18px;
  }

  .phone-frame {
    width: 280px; height: 560px;
    background: #1a1a2e;
    border-radius: 36px;
    border: 3px solid rgba(255,255,255,0.12);
    padding: 12px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.15);
    position: relative;
    overflow: hidden;
  }
  .phone-frame::before {
    content: '';
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
    width: 80px; height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px; z-index: 2;
  }

  .phone-screen {
    width: 100%; height: 100%;
    border-radius: 24px;
    overflow: hidden;
    background: #f1f1f1;
  }
  .phone-screen img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
  }

  .phone-label-title {
    font-size: 16px; font-weight: 700; color: #fff; text-align: center;
  }
  .phone-label-desc {
    font-size: 13px; color: #a1a1aa; text-align: center; max-width: 240px;
  }
</style>
</head>
<body>
  <div class="screenshot-block">
    <div class="top-area">
      <div class="logo-area">
        <img src="${faviconSrc}" alt="InkBot" class="logo-icon" />
        <span class="logo-text">InkBot</span>
      </div>
      <h2 class="headline">
        <span class="highlight">Every Feature</span> Works On Mobile
      </h2>
      <p class="subheadline">Generate, bulk-process, track SEO & manage your store — all fully optimized for any screen size.</p>
    </div>

    <div class="phones-area">
      <div class="phone-wrapper">
        <div class="phone-frame">
          <div class="phone-screen">
            <img src="${mobile1Src}" alt="Dashboard" />
          </div>
        </div>
        <div>
          <div class="phone-label-title">Full App Access</div>
          <div class="phone-label-desc">All pages, all features — optimized for mobile</div>
        </div>
      </div>

      <div class="phone-wrapper">
        <div class="phone-frame">
          <div class="phone-screen">
            <img src="${mobile2Src}" alt="Support" />
          </div>
        </div>
        <div>
          <div class="phone-label-title">Responsive Design</div>
          <div class="phone-label-desc">Seamless experience on phone, tablet & desktop</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await new Promise(r => setTimeout(r, 2000));
  const el = await page.$(".screenshot-block");
  await el.screenshot({ path: outputPath, type: "png" });
  console.log("Done:", outputPath);
  await browser.close();
})();
