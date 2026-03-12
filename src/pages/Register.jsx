// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SEO from "../components/SEO";

const Register = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    register(form);
    navigate("/account");
  };

  return (
    <>
      <SEO
        title="Create Account"
        description="Create your Eminence Hair Boutique account to track orders and manage preferences."
        noindex={true}
      />
      <div className="pt-28 pb-24 px-4 flex justify-center">
      <div className="w-full max-w-md border border-white/10 rounded-2xl p-8 bg-white/5 text-white">
        <h1 className="text-2xl font-light tracking-[0.3em] uppercase mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-white"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-white"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black border border-white/20 rounded-full px-4 py-2 text-sm outline-none focus:border-white"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 text-xs tracking-[0.26em] uppercase border border-white bg-white text-black hover:bg-transparent hover:text-white transition rounded-full"
          >
            Join Eminence
          </button>
        </form>

        <p className="mt-6 text-[11px] text-neutral-500 text-center">
          By creating an account, you agree to receive occasional emails about
          new collections, launches, and offers. You can unsubscribe any time.
        </p>
      </div>
    </div>
    </>
  );
};

export default Register;
