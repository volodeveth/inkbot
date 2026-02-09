import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin && topic !== "SHOP_REDACT") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      // Clean up sessions
      await db.session.deleteMany({ where: { shop } });

      // Revoke API key and reset subscription state (keep data for potential reinstall)
      const uninstalledShop = await db.shop.findUnique({
        where: { shopDomain: shop },
      });
      if (uninstalledShop) {
        await db.shop.update({
          where: { shopDomain: shop },
          data: {
            apiKeyHash: null,
            apiKeyPrefix: null,
            apiKeyCreatedAt: null,
            subscriptionId: null,
            subscriptionStatus: null,
          },
        });
      }
      break;

    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
      // InkBot does not store end-customer personal data.
      // Product data is associated with the shop, not individual customers.
      break;

    case "SHOP_REDACT":
      // Store permanently deleted — delete ALL associated data (GDPR compliance).
      // BrandVoice and Generation records cascade-delete via onDelete: Cascade on Shop.
      await db.supportTicket.deleteMany({ where: { shopDomain: shop } });
      await db.session.deleteMany({ where: { shop } });
      await db.shop.deleteMany({ where: { shopDomain: shop } });
      break;

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
