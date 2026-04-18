/* eslint-env node */
import { supabaseServer } from "../../lib/supabaseServer.js";
import { sendCareGuideEmail, sendReviewRequestEmail } from "../../lib/email.js";

export default async function handler(req, res) {
  // Auth via CRON_SECRET Bearer token
  const authHeader = req.headers.authorization || "";
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const results = { careEmails: 0, reviewEmails: 0, errors: [] };

  try {
    // Care guide emails — orders 3+ days old without care_email_sent
    const { data: careOrders, error: careErr } = await supabaseServer
      .from("orders")
      .select("id, email, order_number")
      .lte("created_at", threeDaysAgo)
      .is("care_email_sent", null)
      .not("email", "is", null)
      .limit(50);

    if (careErr) {
      console.error("Cron: care query error", careErr);
      results.errors.push(`care query: ${careErr.message}`);
    }

    for (const order of careOrders || []) {
      try {
        await sendCareGuideEmail({ to: order.email, orderNumber: order.order_number });

        await supabaseServer
          .from("orders")
          .update({ care_email_sent: now.toISOString() })
          .eq("id", order.id);

        results.careEmails++;
      } catch (err) {
        console.error(`Cron: care email failed for ${order.order_number}`, err.message);
        results.errors.push(`care ${order.order_number}: ${err.message}`);
      }
    }

    // Review request emails — orders 14+ days old without review_email_sent
    const { data: reviewOrders, error: reviewErr } = await supabaseServer
      .from("orders")
      .select("id, email, order_number")
      .lte("created_at", fourteenDaysAgo)
      .is("review_email_sent", null)
      .not("email", "is", null)
      .limit(50);

    if (reviewErr) {
      console.error("Cron: review query error", reviewErr);
      results.errors.push(`review query: ${reviewErr.message}`);
    }

    for (const order of reviewOrders || []) {
      try {
        await sendReviewRequestEmail({ to: order.email, orderNumber: order.order_number });

        await supabaseServer
          .from("orders")
          .update({ review_email_sent: now.toISOString() })
          .eq("id", order.id);

        results.reviewEmails++;
      } catch (err) {
        console.error(`Cron: review email failed for ${order.order_number}`, err.message);
        results.errors.push(`review ${order.order_number}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error("Cron: unexpected error", err?.message || err);
    results.errors.push(`unexpected: ${err?.message || String(err)}`);
  }

  console.log("Cron results:", results);
  res.json({ ok: true, ...results });
}
