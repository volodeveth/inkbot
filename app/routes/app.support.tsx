import { useState, useEffect, useCallback } from "react";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  useLoaderData,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Banner,
  BlockStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { checkUsageLimit } from "~/services/billing.server";
import db from "~/db.server";
import type { PlanKey } from "~/utils/plans";

const TICKET_OFFSET = 123149;

const PLAN_DISPLAY_NAMES: Record<PlanKey, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  UNLIMITED: "Elite",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const usage = await checkUsageLimit(session.shop);

  return json({
    shop: session.shop,
    plan: usage.plan,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const subject = String(formData.get("subject") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const plan = String(formData.get("plan") || "");
  const shop = session.shop;

  if (!subject || !description || !email) {
    return json({ error: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ error: "Please enter a valid email address." });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return json({ error: "Email service is not configured. Please contact support directly at starbowshine@gmail.com." });
  }

  const planName = PLAN_DISPLAY_NAMES[plan as PlanKey] || plan;

  try {
    const ticket = await db.supportTicket.create({
      data: { shopDomain: shop, email, subject, description, plan: planName },
    });
    const ticketNumber = TICKET_OFFSET + ticket.id;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Describely <onboarding@resend.dev>",
        to: "starbowshine@gmail.com",
        subject: `[Describely Support #${ticketNumber}] ${subject}`,
        text: `Ticket: #${ticketNumber}\nShop: ${shop}\nPlan: ${planName}\nReply to: ${email}\n\n${description}`,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend API error:", res.status, body);
      return json({ error: "Failed to send message. Please try again later." });
    }

    return json({ success: true, ticketNumber });
  } catch (err) {
    console.error("Resend fetch error:", err);
    return json({ error: "Failed to send message. Please try again later." });
  }
}

export default function Support() {
  const { shop, plan } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as any;
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (actionData?.success) {
      setEmail("");
      setSubject("");
      setDescription("");
    }
  }, [actionData]);

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("description", description);
    formData.set("plan", plan);
    submit(formData, { method: "post" });
  }, [email, subject, description, plan, submit]);

  const planDisplayName = PLAN_DISPLAY_NAMES[plan as PlanKey] || plan;

  return (
    <Page title="Support" backAction={{ url: "/app" }}>
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {actionData?.success && (
              <Banner
                title="Message sent!"
                tone="success"
              >
                <p>Your ticket <strong>#{actionData.ticketNumber}</strong> has been created. We'll get back to you as soon as possible.</p>
              </Banner>
            )}
            {actionData?.error && (
              <Banner
                title="Error"
                tone="critical"
              >
                <p>{actionData.error}</p>
              </Banner>
            )}
            <Card>
              <FormLayout>
                <TextField
                  label="Shop"
                  value={shop}
                  disabled
                  autoComplete="off"
                />
                <TextField
                  label="Plan"
                  value={planDisplayName}
                  disabled
                  autoComplete="off"
                />
                <TextField
                  label="Your email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  requiredIndicator
                  autoComplete="email"
                />
                <TextField
                  label="Subject"
                  value={subject}
                  onChange={setSubject}
                  placeholder="What do you need help with?"
                  requiredIndicator
                  autoComplete="off"
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={setDescription}
                  multiline={4}
                  placeholder="Describe your issue or question in detail..."
                  requiredIndicator
                  autoComplete="off"
                />
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  Send Message
                </Button>
              </FormLayout>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
