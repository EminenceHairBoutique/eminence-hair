import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import AccountDashboard from "../components/account/AccountDashboard";
import SEO from "../components/SEO";

const TabButton = ({ active, children, onClick }) => (
  <Button
    type="button"
    onClick={onClick}
    variant="ghost"
    className={`px-4 py-2 h-auto rounded-none text-[11px] tracking-[0.26em] uppercase transition border-b
      ${active ? "text-neutral-900 border-neutral-900" : "text-neutral-500 border-transparent hover:text-neutral-900"}`}
  >
    {children}
  </Button>
);

const Input = ({ label, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">{label}</span>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70
                 focus:outline-none focus:ring-1 focus:ring-black text-sm"
    />
  </label>
);

export default function Account() {
  const [tab, setTab] = useState("signin");
  const [showOAuthConsent, setShowOAuthConsent] = useState(false);

  const { user, login, register, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔁 redirect once authenticated */
  useEffect(() => {
    if (user && !showOAuthConsent) {
      navigate("/account");
    }
  }, [user, showOAuthConsent, navigate]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGGED-IN DASHBOARD
  ========================= */

  if (user && !showOAuthConsent) {
    return (
      <>
        <SEO
          title="My Account"
          description="Manage your Eminence Hair account, orders, and preferences."
        />
        <AccountDashboard />
      </>
    );
  }

  /* =========================
     AUTH UI (UNCHANGED)
  ========================= */

  return (
    <>
      <SEO
        title="Sign In / Create Account"
        description="Access your Eminence Hair account."
      />
      <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
        <div className="max-w-md mx-auto px-6">
          <div className="mb-8 text-center">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600">
              Account
            </p>
            <h1 className="text-3xl font-light tracking-wide">Welcome</h1>
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <TabButton active={tab === "signin"} onClick={() => setTab("signin")}>
              Sign In
            </TabButton>
            <TabButton active={tab === "create"} onClick={() => setTab("create")}>
              Create Account
            </TabButton>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-6 space-y-5">
            {tab === "signin" && (
              <>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button onClick={handleLogin} disabled={loading} className="w-full">
                  Sign In
                </Button>

                <Button
                  variant="outline"
                  onClick={async () => {
                    await loginWithGoogle();
                    setShowOAuthConsent(true);
                  }}
                  className="w-full"
                >
                  Continue with Google
                </Button>

                <p className="mt-4 text-[11px] text-neutral-600 text-center">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="underline">Terms & Conditions</Link>,{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>, and{" "}
                  <Link to="/returns" className="underline">Returns & Exchanges Policy</Link>.
                </p>
              </>
            )}

            {tab === "create" && (
              <>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <p className="mt-3 text-[11px] text-neutral-600 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-neutral-900">
                    Terms & Conditions
                  </Link>,{" "}
                  <Link to="/privacy" className="underline hover:text-neutral-900">
                    Privacy Policy
                  </Link>, and{" "}
                  <Link to="/returns" className="underline hover:text-neutral-900">
                    Returns & Exchanges Policy
                  </Link>.
                </p>

                <Button onClick={handleRegister} disabled={loading} className="w-full">
                  Create Account
                </Button>

                <Button
                  variant="outline"
                  onClick={async () => {
                    await loginWithGoogle();
                    setShowOAuthConsent(true);
                  }}
                  className="w-full"
                >
                  Continue with Google
                </Button>

                <p className="mt-4 text-[11px] text-neutral-600 text-center">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="underline">Terms & Conditions</Link>,{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>, and{" "}
                  <Link to="/returns" className="underline">Returns & Exchanges Policy</Link>.
                </p>
              </>
            )}

            {error && (
              <p className="text-xs text-red-600 text-center pt-2">{error}</p>
            )}
          </div>

          {showOAuthConsent && (
            <div className="mt-6 text-center text-[11px] text-neutral-600 space-y-3">
              <p>
                By continuing, you agree to our{" "}
                <Link to="/terms" className="underline hover:text-neutral-900">
                  Terms & Conditions
                </Link>,{" "}
                <Link to="/privacy" className="underline hover:text-neutral-900">
                  Privacy Policy
                </Link>, and{" "}
                <Link to="/returns" className="underline hover:text-neutral-900">
                  Returns & Exchanges Policy
                </Link>.
              </p>

              <Button
                className="mt-2"
                onClick={() => navigate("/account")}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
