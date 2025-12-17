import "dotenv/config";
import express from "express";
import cors from "cors";

import createCheckoutSession from "./api/create-checkout-session.js";
import stripeWebhook from "./api/stripe-webhook.js";

const app = express();

app.use(cors());

// ❌ DO NOT use express.json() globally before webhook

// ✅ Webhook route — RAW body
app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ✅ Checkout session route — JSON body
app.post(
  "/api/create-checkout-session",
  express.json(),
  createCheckoutSession
);

app.listen(3000, () => {
  console.log("✅ Local API running on http://localhost:3000");
});
