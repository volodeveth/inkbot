import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { confirmSubscription } from "~/services/billing.server";

/**
 * This route handles the return from Shopify's billing confirmation page.
 * After a merchant approves/declines a subscription, Shopify redirects here.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const chargeId = url.searchParams.get("charge_id");

  if (chargeId) {
    await confirmSubscription(session.shop, chargeId);
  }

  return redirect("/app/billing");
}
