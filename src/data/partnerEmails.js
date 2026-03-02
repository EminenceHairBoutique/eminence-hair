/**
 * src/data/partnerEmails.js
 * Email HTML templates for partner tier promotions.
 * Used by the Resend integration in the admin approval flow.
 *
 * Usage: replace {{name}} with the partner's first name before sending.
 */

/** Escape HTML special characters to prevent XSS in email templates. */
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const headerHtml = `
  <div style="background:#111;padding:32px 40px 24px;text-align:center;">
    <p style="margin:0;color:#D4AF37;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;font-family:Georgia,serif;">
      Eminence Hair Boutique
    </p>
  </div>
`;

const footerHtml = `
  <div style="background:#111;padding:24px 40px 32px;text-align:center;margin-top:40px;">
    <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;font-family:sans-serif;">
      The Eminence Standard
    </p>
    <p style="margin:0;color:#555;font-size:11px;font-family:sans-serif;line-height:1.6;">
      No free product guarantees. No inflated promises.<br/>
      Performance earns access.
    </p>
    <p style="margin:16px 0 0;color:#444;font-size:10px;font-family:sans-serif;">
      &copy; Eminence Hair Boutique &bull; Luxury Human Hair
    </p>
  </div>
`;

function wrapTemplate(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#F9F7F4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F7F4;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td>${headerHtml}</td></tr>
        <tr><td style="padding:40px;">${content}</td></tr>
        <tr><td>${footerHtml}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(label, href) {
  return `
    <div style="text-align:center;margin:32px 0 0;">
      <a href="${href}"
         style="display:inline-block;background:#111;color:#fff;text-decoration:none;
                font-size:10px;letter-spacing:0.26em;text-transform:uppercase;
                padding:14px 32px;border-radius:999px;font-family:sans-serif;">
        ${label}
      </a>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────
// 1. Stylist Welcome — Tier 1 entry
// ─────────────────────────────────────────────────────────────────
export const stylistWelcomeEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#888;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Welcome</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      Welcome to the Eminence Stylist Program
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      You've been approved as a <strong>Registered Stylist</strong> partner. Your application passed review
      and you now have access to entry-level wholesale pricing and our tester SKU catalog.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Tier 1 Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Entry-level wholesale pricing on select SKUs</li>
        <li>Access to paid tester sets</li>
        <li>Partner Portal login</li>
      </ul>
    </div>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Next step: log in to your Partner Portal to view wholesale pricing and place your first order.
    </p>
    ${ctaButton("Go to Partner Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 2. Approved Salon Partner — Tier 2
// ─────────────────────────────────────────────────────────────────
export const approvedSalonPartnerEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#888;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Promotion</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      You've been promoted to Approved Salon Partner
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Your performance has earned you <strong>Approved Salon Partner</strong> status. This is Tier 2 of the
      Eminence Stylist Program.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Tier 2 Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Revenue split eligibility</li>
        <li>Full Partner Portal access</li>
        <li>Priority support channel</li>
      </ul>
    </div>
    ${ctaButton("Go to Partner Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 3. Preferred Salon Partner — Tier 3
// ─────────────────────────────────────────────────────────────────
export const preferredSalonPartnerEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#888;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Elevation</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      You've been elevated to Preferred Salon Partner
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      You've reached <strong>Preferred Salon Partner</strong> — Tier 3. This reflects sustained performance,
      brand alignment, and a track record we trust.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Tier 3 Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Best-in-class wholesale pricing</li>
        <li>Priority restocks on new inventory</li>
        <li>Potential site feature placement</li>
      </ul>
    </div>
    ${ctaButton("Go to Partner Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 4. Atelier Partner Invitation — Tier 4 (invite only)
// ─────────────────────────────────────────────────────────────────
export const atelierPartnerEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#D4AF37;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Invitation</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      You've been invited to Eminence Atelier
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      This is a personal invitation to join the <strong>Eminence Atelier Partner</strong> program — our
      highest tier, reserved for a select few. You've earned this.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Atelier Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Custom pricing negotiated directly</li>
        <li>Editorial campaign features</li>
        <li>First access to exclusive launches</li>
        <li>Direct line to the Eminence team</li>
      </ul>
    </div>
    ${ctaButton("Access Your Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 5. Affiliate Creator Welcome — Creator Tier 1
// ─────────────────────────────────────────────────────────────────
export const affiliateCreatorEmail = (referralCode = "", portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#888;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Welcome</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      Welcome to the Eminence Creator Program
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      You've been approved as an <strong>Affiliate Creator</strong>. Your referral link is active and you'll
      earn 10–15% commission on every sale you drive.
    </p>
    ${referralCode ? `
    <div style="background:#111;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Referral Code</p>
      <p style="margin:0;color:#D4AF37;font-size:22px;letter-spacing:0.18em;font-family:Georgia,serif;">${escapeHtml(referralCode)}</p>
    </div>` : ""}
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Tier 1 Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Unique referral link + code</li>
        <li>10–15% commission on referred sales</li>
        <li>Monthly earnings dashboard in Partner Portal</li>
      </ul>
    </div>
    <p style="color:#444;font-size:13px;line-height:1.7;margin:0 0 16px;border-left:2px solid #ddd;padding-left:12px;">
      Note: Product gifting is not included at Tier 1. Gifting is earned at Tier 2+.
    </p>
    ${ctaButton("Go to Partner Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 6. Featured Creator Promotion — Creator Tier 2
// ─────────────────────────────────────────────────────────────────
export const featuredCreatorEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#888;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Promotion</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      You've been promoted to Featured Creator
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Your conversions earned you <strong>Featured Creator</strong> status — Tier 2. This unlocks paid
      campaigns, product gifting, and an increased commission rate.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Tier 2 Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>15–25% commission on referred sales</li>
        <li>Paid campaign opportunities</li>
        <li>Product gifting eligibility</li>
        <li>Priority content review</li>
      </ul>
    </div>
    ${ctaButton("Go to Partner Portal", portalUrl)}
  `);

// ─────────────────────────────────────────────────────────────────
// 7. Brand Muse Invitation — Creator Tier 3 (invite only)
// ─────────────────────────────────────────────────────────────────
export const brandMuseEmail = (portalUrl = "https://eminencehair.com/partner-portal") =>
  wrapTemplate(`
    <p style="margin:0 0 4px;color:#D4AF37;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;">Chosen</p>
    <h1 style="margin:8px 0 20px;font-size:24px;font-weight:300;color:#111;font-family:Georgia,serif;">
      You've been chosen as an Eminence Brand Muse
    </h1>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      Hi {{name}},
    </p>
    <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
      This is a personal invitation. You've been selected as an <strong>Eminence Brand Muse</strong> — the
      highest tier in our Creator Program. This is invite-only and reflects the trust we have in your voice and work.
    </p>
    <div style="background:#F9F7F4;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0 0 8px;color:#888;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;">Your Brand Muse Benefits</p>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:14px;line-height:1.8;">
        <li>Campaign shoots with the Eminence team</li>
        <li>Exclusive product launches — first access</li>
        <li>Top commission tier (25%)</li>
        <li>Co-branded content opportunities</li>
      </ul>
    </div>
    ${ctaButton("Access Your Portal", portalUrl)}
  `);

export default {
  stylistWelcomeEmail,
  approvedSalonPartnerEmail,
  preferredSalonPartnerEmail,
  atelierPartnerEmail,
  affiliateCreatorEmail,
  featuredCreatorEmail,
  brandMuseEmail,
};
