// src/components/DiscountModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";

const DiscountModal = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  // ⭐ DEV MODE OVERRIDE — makes popup always show for testing
  const DEV_ALWAYS_SHOW = false; // set to false in production

  useEffect(() => {
    const seen = localStorage.getItem("eminence_discount_seen");

    if (!user && (!seen || DEV_ALWAYS_SHOW)) {
      const timer = setTimeout(() => setOpen(true), 2000); // show after 2s
      return () => clearTimeout(timer);
    }
  }, [user]);

  const closeModal = () => {
    setOpen(false);
    localStorage.setItem("eminence_discount_seen", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    localStorage.setItem("eminence_email", email);
    closeModal();

    alert(
      "Welcome to Eminence. Use code EMINENCE10 at checkout for 10% off your first order."
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="discount-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-md bg-black border border-white/15 rounded-2xl p-8 text-white relative shadow-2xl shadow-black/50"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white text-lg"
            >
              ✕
            </button>

            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400 mb-3">
              Welcome to Eminence
            </p>

            <h2 className="text-2xl font-light tracking-[0.15em] uppercase mb-4 leading-tight">
              Enjoy 10% Off  
              <span className="block text-sm tracking-normal font-normal text-neutral-300">
                your first luxury piece
              </span>
            </h2>

            <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
              Join the private list for drops, capsule collections, and care
              rituals crafted for the modern muse.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/25 rounded-full px-4 py-3 text-sm outline-none focus:border-white"
              />

              <button
                type="submit"
                className="w-full py-3 text-xs tracking-[0.26em] uppercase border border-white bg-white text-black rounded-full hover:bg-transparent hover:text-white transition"
              >
                Unlock 10% Off
              </button>
            </form>

            <p className="mt-5 text-[10px] text-neutral-500 leading-relaxed">
              By continuing, you agree to receive Eminence newsletters.  
              No spam — just silkier days ahead.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiscountModal;
