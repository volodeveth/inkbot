import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">Dashboard</Link>
        <Link to="/app/generate">Generate</Link>
        <Link to="/app/bulk">Bulk Generate</Link>
        <Link to="/app/history">History</Link>
        <Link to="/app/api-docs">API</Link>
        <Link to="/app/settings">Settings</Link>
        <Link to="/app/billing">Billing</Link>
        <Link to="/app/support">Support</Link>
      </NavMenu>
      <Outlet />
      <div style={{
        textAlign: "center",
        padding: "24px 16px 16px",
        borderTop: "1px solid #e1e3e5",
        marginTop: "32px",
        fontSize: "13px",
        color: "#6d7175",
      }}>
        Built by{" "}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.open("https://volodeveth.vercel.app/", "_blank"); }}
          style={{ color: "#5c6ac4", textDecoration: "none", cursor: "pointer" }}
        >
          VoloDev.eth
        </a>
        <span style={{ margin: "0 8px", color: "#8c9196" }}>•</span>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.open("/privacy", "_blank"); }}
          style={{ color: "#5c6ac4", textDecoration: "none", cursor: "pointer" }}
        >
          Privacy
        </a>
        <span style={{ margin: "0 8px", color: "#8c9196" }}>•</span>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.open("/terms", "_blank"); }}
          style={{ color: "#5c6ac4", textDecoration: "none", cursor: "pointer" }}
        >
          Terms
        </a>
        <span style={{ margin: "0 8px", color: "#8c9196" }}>•</span>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.open("/faq", "_blank"); }}
          style={{ color: "#5c6ac4", textDecoration: "none", cursor: "pointer" }}
        >
          FAQ
        </a>
      </div>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
