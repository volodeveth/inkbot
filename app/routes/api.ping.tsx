import type { LoaderFunctionArgs } from "@remix-run/node";

export const config = { maxDuration: 5 };

export async function loader({ request }: LoaderFunctionArgs) {
  return new Response("pong", { status: 200 });
}
