import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { syncPlanFromShopify } from "~/services/billing.server";

/**
 * This route handles the return from Shopify's billing/pricing page.
 * Syncs the current plan from Shopify and redirects to billing.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { session, admin } = await authenticate.admin(request);

  await syncPlanFromShopify(session.shop, admin);

  return redirect("/app/billing");
}
