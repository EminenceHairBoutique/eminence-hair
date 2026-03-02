/* eslint-env node */
import { supabaseServer } from "../../lib/supabaseServer.js";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getBearerToken(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (!auth) return null;
  const m = String(auth).match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function adminEmailAllowlist() {
  const raw = process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function parseJsonBody(req) {
  const b = req.body;
  if (b && typeof b === "object") return b;
  if (typeof b === "string") {
    try {
      return JSON.parse(b);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return null;

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

async function getUserFromReq(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (error) return null;
    return data?.user || null;
  } catch {
    return null;
  }
}

async function ensureProfileRow(userId, email) {
  if (!userId) return;
  // Upsert is safe with service role.
  await supabaseServer
    .from("profiles")
    .upsert({ id: userId, email: email || null }, { onConflict: "id" });
}

function generateReferralCode(fullName) {
  const namePart = String(fullName || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6)
    .padEnd(6, "X");
  const randPart = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `EMI-${namePart}-${randPart}`;
}

function commissionRateForTier(tier) {
  const map = {
    affiliate_creator: 10,
    featured_creator: 20,
    brand_muse: 25,
  };
  return map[String(tier || "")] ?? null;
}

const CREATOR_TIERS = new Set(["affiliate_creator", "featured_creator", "brand_muse"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  const user = await getUserFromReq(req);
  if (!user) return json(res, 401, { error: "Unauthorized" });

  const allow = adminEmailAllowlist();
  const email = String(user.email || "").toLowerCase();
  if (!allow.length || !allow.includes(email)) {
    return json(res, 403, { error: "Forbidden" });
  }

  const body = await parseJsonBody(req);
  if (!body) return json(res, 400, { error: "Invalid JSON" });

  const applicationId = body.applicationId || body.id;
  const action = String(body.action || "").toLowerCase();
  const partnerTier = body.partnerTier || "wholesale";

  if (!applicationId) return json(res, 400, { error: "applicationId is required" });
  if (!['approve','approved','reject','rejected','pending'].includes(action)) {
    return json(res, 400, { error: "Invalid action" });
  }

  // Fetch application
  const { data: app, error: appErr } = await supabaseServer
    .from("partner_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (appErr || !app) {
    return json(res, 404, { error: "Application not found" });
  }

  let targetUserId = app.user_id;
  const targetEmail = String(app.email || "").trim().toLowerCase();

  // If user_id missing but email exists, attempt lookup.
  if (!targetUserId && targetEmail) {
    try {
      const { data } = await supabaseServer.auth.admin.getUserByEmail(targetEmail);
      targetUserId = data?.user?.id || null;
    } catch (e) {
      console.warn("Admin approve: getUserByEmail failed", e);
    }
  }

  const nextStatus = action.startsWith("approve") ? "approved" : action.startsWith("reject") ? "rejected" : "pending";

  try {
    // Update application row
    const { error: updAppErr } = await supabaseServer
      .from("partner_applications")
      .update({
        status: nextStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        partner_tier: nextStatus === "approved" ? partnerTier : null,
      })
      .eq("id", applicationId);

    if (updAppErr) {
      return json(res, 500, { error: "Failed to update application", details: String(updAppErr.message || updAppErr) });
    }

    // Update profile tier/status if we have a target user id
    if (targetUserId) {
      await ensureProfileRow(targetUserId, targetEmail);

      // Fetch the user's current tier from profiles for accurate audit history
      const { data: currentProfile } = await supabaseServer
        .from("profiles")
        .select("partner_tier, referral_code")
        .eq("id", targetUserId)
        .maybeSingle();

      const previousTier = currentProfile?.partner_tier || null;

      const profilePatch =
        nextStatus === "approved"
          ? { account_tier: "partner", partner_status: "approved", partner_tier: partnerTier }
          : nextStatus === "rejected"
            ? { account_tier: "customer", partner_status: "rejected", partner_tier: null }
            : { account_tier: "partner_pending", partner_status: "pending", partner_tier: null };

      // Set partner_track from application if available
      if (app.partner_track) {
        profilePatch.partner_track = app.partner_track;
      }

      // Creator-specific: generate referral code and set commission rate on approval
      if (nextStatus === "approved" && CREATOR_TIERS.has(partnerTier)) {
        const commissionRate = commissionRateForTier(partnerTier);
        if (commissionRate !== null) {
          profilePatch.commission_rate = commissionRate;
        }

        // Only generate referral code if not already set on profile
        let referralCode = currentProfile?.referral_code || null;
        if (!referralCode) {
          referralCode = generateReferralCode(app.full_name);
          profilePatch.referral_code = referralCode;
        }

        // Store referral code + commission rate on the application row (single update)
        const appUpdate = { referral_code: referralCode };
        if (commissionRate !== null) {
          appUpdate.commission_rate = commissionRate;
        }
        await supabaseServer
          .from("partner_applications")
          .update(appUpdate)
          .eq("id", applicationId);
      }

      // Set tier_promoted_at on approval
      if (nextStatus === "approved") {
        profilePatch.tier_promoted_at = new Date().toISOString();
      }

      const { error: profErr } = await supabaseServer
        .from("profiles")
        .update(profilePatch)
        .eq("id", targetUserId);

      if (profErr) {
        console.warn("Admin approve: profile update failed", profErr);
      }

      // Write tier history audit row on approval
      if (nextStatus === "approved") {
        const { error: histErr } = await supabaseServer
          .from("partner_tier_history")
          .insert({
            user_id: targetUserId,
            previous_tier: previousTier,
            new_tier: partnerTier,
            changed_by: user.id,
            reason: `Admin approval via application ${applicationId}`,
          });

        if (histErr) {
          console.warn("Admin approve: tier history insert failed", histErr);
        }
      }
    }

    return json(res, 200, { ok: true, status: nextStatus, targetUserId: targetUserId || null });
  } catch (e) {
    console.error("Admin partner update: unhandled error", e);
    return json(res, 500, { error: "Server error" });
  }
}
