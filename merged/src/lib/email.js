import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  amount,
}) {
  return resend.emails.send({
    from: "Eminence Hair <orders@eminencehair.com>",
    to,
    subject: `Order ${orderNumber} confirmed — Eminence Hair`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        
        <h1 style="font-weight: 300; letter-spacing: 0.04em;">
          Order Confirmed
        </h1>

        <p>
          Thank you for choosing <strong>Eminence Hair</strong>.
        </p>

        <p>
          Your order <strong>${orderNumber}</strong> has been successfully placed and is now being prepared by our quality control team.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

        <p>
          <strong>Total Paid:</strong><br />
          $${(amount / 100).toFixed(2)} USD
        </p>

        <p>
          <strong>What happens next:</strong>
        </p>

        <ul style="padding-left: 18px;">
          <li>Final quality inspection</li>
          <li>Discreet luxury packaging</li>
          <li>Shipment within <strong>2–3 business days</strong></li>
        </ul>

        <p>
          You’ll receive a shipping confirmation with tracking details as soon as your order leaves our facility.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

        <p style="font-size: 12px; color: #666;">
          Eminence Hair<br />
          Premium Human Hair · Discreet Packaging · Verified Quality
        </p>

        <p style="font-size: 12px; color: #666;">
          Need help? Contact us at <a href="mailto:support@eminencehair.com">support@eminencehair.com</a>
        </p>
      </div>
    `,
  });
}
