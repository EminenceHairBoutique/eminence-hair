import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  amount,
}) {
  return resend.emails.send({
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
