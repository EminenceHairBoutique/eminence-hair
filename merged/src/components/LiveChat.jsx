import { useEffect } from "react";
import { useUser } from "../context/UserContext";

/**
 * LiveChat (Crisp)
 *
 * - Add VITE_CRISP_WEBSITE_ID to enable.
 * - Optional: set VITE_CRISP_VISIBILITY=partner to only show chat for approved partners.
 */
export default function LiveChat() {
  const { user } = useUser();

  useEffect(() => {
    const websiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    // Crisp bootstrap (only once)
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = websiteId;

    if (document.getElementById("crisp-chat")) return;

    const s = document.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    s.id = "crisp-chat";
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const websiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;
    if (!websiteId) return;
    if (!window.$crisp) return;

    const visibility = String(import.meta.env.VITE_CRISP_VISIBILITY || "all").toLowerCase();
    const tier = String(user?.accountTier || "guest").toLowerCase();
    const partnerStatus = String(user?.partnerStatus || "").toLowerCase();
    const isPartner = tier === "partner" || tier === "wholesale" || tier.startsWith("partner_") || partnerStatus === "approved";

    try {
      // Identity + context
      if (user?.email) window.$crisp.push(["set", "user:email", [user.email]]);
      if (user?.name) window.$crisp.push(["set", "user:nickname", [user.name]]);

      window.$crisp.push([
        "set",
        "session:data",
        [
          [["account_tier", tier]],
          [["partner_status", partnerStatus]],
        ],
      ]);

      // Visibility gating (optional)
      if (visibility === "partner") {
        window.$crisp.push(["do", isPartner ? "chat:show" : "chat:hide"]);
      }
    } catch (_e) {
      // ignore
    }
  }, [user?.email, user?.name, user?.accountTier, user?.partnerStatus]);

  return null;
}
