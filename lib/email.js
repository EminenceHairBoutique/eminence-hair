import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function requireResend() {
  if (!resend) {
    throw new Error(
      "Missing RESEND_API_KEY. Set it in your environment variables to send emails."
    );
  }
  return resend;
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  amount,
}) {
  return requireResend().emails.send({
    from: "Eminence Hair <orders@eminenceluxuryhair.com>",
    to,
    reply_to: "support@eminenceluxuryhair.com",
    subject: `Order ${orderNumber} confirmed`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Thank you for your order</h2>

        <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>

        <p><strong>Total paid:</strong> $${(amount / 100).toFixed(2)}</p>

        <p>
          Your order is now being processed and will ship within
          <strong>2–3 business days</strong>.
        </p>

        <p>
          You’ll receive another email once your order ships.
        </p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          Eminence Hair · Discreet luxury packaging · Premium quality guaranteed
        </p>
      </div>
    `,
  });
}

export async function sendConciergeRequestEmail({
  type,
  payload,
  to = "support@eminenceluxuryhair.com",
}) {
  const safeType = String(type || "request").replace(/[^a-z0-9_-]/gi, "");

  // Flatten payload for readability
  const entries = Object.entries(payload || {})
    .filter(([k, v]) => k !== "website" && v != null && String(v).trim() !== "")
    .map(([k, v]) => [k, String(v)])
    .slice(0, 80);

  const rows = entries
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding: 8px 10px; border: 1px solid #eee; font-weight: 600; background: #fafafa;">${k}</td>
          <td style="padding: 8px 10px; border: 1px solid #eee;">${v.replace(
            /</g,
            "&lt;"
          ).replace(/>/g, "&gt;")}</td>
        </tr>
      `
    )
    .join("");

  const subjectMap = {
    custom_order: "New Custom Order Request",
    custom_atelier: "New Custom Atelier Request",
    private_consult: "New Private Consult Request",
    contact: "New Contact Message",
    newsletter: "New Newsletter Signup",
    ar_tryon_waitlist: "AR Try-On Beta Waitlist",
  };

  const subject = subjectMap[safeType] || "New Concierge Request";

  return requireResend().emails.send({
    from: "Eminence Hair <concierge@eminenceluxuryhair.com>",
    to,
    reply_to: payload?.email || "support@eminenceluxuryhair.com",
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 720px; line-height: 1.45;">
        <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #666;">
          Eminence Concierge • ${safeType}
        </p>

        <h2 style="margin: 10px 0 6px; font-weight: 500;">${subject}</h2>
        <p style="color: #555; margin: 0 0 18px;">Submitted from the website form.</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${rows || ""}
        </table>

        <p style="margin-top: 18px; font-size: 12px; color: #666;">
          Reply to the client using the email above. If this looks like spam, check the hidden honeypot field.
        </p>
      </div>
    `,
  });
}
