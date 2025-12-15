import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const STORAGE_KEY = "eminence_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
      })
    );
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.25)] p-6">
        <div className="space-y-4">
          <p className="text-sm text-neutral-800 leading-relaxed">
            We use cookies and similar technologies to ensure the best experience,
            analyze traffic, and personalize content. You may accept all cookies
            or choose essential cookies only.
          </p>

          <p className="text-xs text-neutral-600">
            Learn more in our{" "}
            <Link to="/privacy" className="underline hover:text-neutral-900">
              Privacy Policy
            </Link>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={acceptAll}
              className="rounded-full px-6 text-[11px] tracking-[0.26em] uppercase"
            >
              Accept All
            </Button>

            <Button
              variant="outline"
              onClick={acceptEssential}
              className="rounded-full px-6 text-[11px] tracking-[0.26em] uppercase"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
