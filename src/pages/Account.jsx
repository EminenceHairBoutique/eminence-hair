// src/pages/Account.jsx
import React, { useState } from "react";
import { Button } from "../components/ui/button";

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

  return (
    <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
      <div className="max-w-md mx-auto px-6">
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600">Account</p>
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

        <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl
                        shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-6 space-y-5">
          {tab === "signin" && (
            <>
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input label="Password" type="password" placeholder="••••••••" />

              <Button
                type="button"
                className="w-full mt-2 py-3 h-auto rounded-full bg-neutral-900 text-[#F9F7F4]
                           text-[11px] tracking-[0.26em] uppercase hover:bg-black transition"
              >
                Sign In
              </Button>

              <p className="text-xs text-neutral-600 text-center mt-2">
                Secure access to your orders and preferences.
              </p>
            </>
          )}

          {tab === "create" && (
            <>
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input label="Password" type="password" placeholder="Create a password" />
              <Input label="Confirm Password" type="password" placeholder="Repeat password" />

              <Button
                type="button"
                className="w-full mt-2 py-3 h-auto rounded-full bg-neutral-900 text-[#F9F7F4]
                           text-[11px] tracking-[0.26em] uppercase hover:bg-black transition"
              >
                Create Account
              </Button>

              <p className="text-xs text-neutral-600 leading-relaxed text-center mt-2">
                Account features are live. Order history and saved preferences will expand as we launch additional features.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
