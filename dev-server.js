import "dotenv/config";
import express from "express";
import cors from "cors";
import createCheckoutSession from "./api/create-checkout-session.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/create-checkout-session", createCheckoutSession);

app.listen(3000, () => {
  console.log("✅ Local API running on http://localhost:3000");
});
