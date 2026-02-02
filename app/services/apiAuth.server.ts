import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { hashApiKey, isValidApiKeyFormat } from "~/services/apiKey.server";
import { getShopByApiKeyHash } from "~/models/shop.server";

interface ApiAuthResult {
  shopDomain: string;
  authMethod: "api_key" | "session";
}

export async function authenticateApiRequest(
  request: Request
): Promise<ApiAuthResult> {
  const authHeader = request.headers.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer dsc_")) {
    const apiKey = authHeader.slice("Bearer ".length);

    if (!isValidApiKeyFormat(apiKey)) {
      throw json({ error: "Invalid API key format" }, { status: 401 });
    }

    const hash = hashApiKey(apiKey);
    const shop = await getShopByApiKeyHash(hash);

    if (!shop) {
      throw json({ error: "Invalid API key" }, { status: 401 });
    }

    if (shop.plan !== "UNLIMITED") {
      throw json(
        { error: "API key access requires the Unlimited plan" },
        { status: 403 }
      );
    }

    return { shopDomain: shop.shopDomain, authMethod: "api_key" };
  }

  // Fall back to Shopify session auth
  const { session } = await authenticate.admin(request);
  return { shopDomain: session.shop, authMethod: "session" };
}
