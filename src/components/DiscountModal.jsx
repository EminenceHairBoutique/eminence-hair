import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button } from "./ui/button";
import { subscribeEmail } from "../utils/subscribe";

export default function DiscountModal() {
  const { user } = useUser();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) return;
    if (location.pathname.includes("checkout")) return;
    if (sessionStorage.getItem("eminence_discount_seen")) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("eminence_discount_seen", "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, [user, location.pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">
              Holiday Welcome
            </p>
            <h2 className="text-2xl font-light mb-3">
              A Gift from Eminence
            </h2>

            <p className="text-sm text-neutral-600 mb-6">
              Enjoy <strong>10% off</strong> and <strong>complimentary shipping</strong> on
              your first order. A limited-time seasonal thank you.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-full px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-black"
            />

            <Button
              disabled={loading}
              className="w-full rounded-full text-xs tracking-[0.25em] uppercase"
              onClick={async () => {
                const next = String(email || "").trim();
                if (!next) return;

                setError("");
                try {
                  setLoading(true);
                  await subscribeEmail({ email: next, source: "discount_modal" });
                  localStorage.setItem("eminence_discount_email", next);
                  setSubmitted(true);
                } catch (e) {
                  setError(e?.message || "Something went wrong. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Unlocking..." : "Unlock My Gift"}
            </Button>

            {error && (
              <p className="mt-3 text-xs text-red-600">{error}</p>
            )}

            <p className="text-xs text-neutral-400 mt-4">
              By continuing, you agree to receive occasional updates. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-3">
              Your Code
            </p>
            <h2 className="text-2xl font-light mb-4">
              WELCOME10
            </h2>

            <p className="text-sm text-neutral-600 mb-6">
              Apply this code at checkout to enjoy your holiday gift.
            </p>

            <Button
              className="w-full rounded-full text-xs tracking-[0.25em] uppercase"
              onClick={() => setOpen(false)}
            >
              Start Shopping
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
