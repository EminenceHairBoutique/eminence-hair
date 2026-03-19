// src/components/Footer.jsx — Luxury Editorial Footer

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { BRAND, SOCIAL } from "../config/brand";

const Footer = () => {
  const hasSocials = SOCIAL.instagram || SOCIAL.tiktok || SOCIAL.youtube;

  return (
    <footer className="bg-[#0E0E0E] text-[#F9F7F4] pt-16 pb-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* TOP SECTION — LOGO + SLOGAN */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37] opacity-80" />
            <span className="tracking-[0.38em] text-[12px] font-light uppercase text-neutral-300">
              {BRAND.fullName}
            </span>
          </div>
          <p className="max-w-sm text-[11px] text-neutral-500 leading-relaxed tracking-wide">
            Luxury human hair, crafted in our partner atelier.
            Designed for women who expect their hair to perform like couture.
          </p>
        </div>

        {/* MIDDLE SECTION — 4 COLUMNS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-[12px] tracking-wide">

          <div className="space-y-2.5">
            <p className="text-neutral-500 tracking-[0.26em] uppercase text-[10px] mb-4">
              Shop
            </p>
            <Link to="/shop" className="hover:text-neutral-200 transition block text-neutral-400">All Products</Link>
            <Link to="/shop/preorders" className="hover:text-neutral-200 transition block text-neutral-400">Pre-Orders</Link>
            <Link to="/ready-to-ship" className="hover:text-neutral-200 transition block text-neutral-400">Ready-to-Ship</Link>
            <Link to="/shop/wigs" className="hover:text-neutral-200 transition block text-neutral-400">Wigs</Link>
            <Link to="/shop/bundles" className="hover:text-neutral-200 transition block text-neutral-400">Bundles</Link>
          </div>

          <div className="space-y-2.5">
            <p className="text-neutral-500 tracking-[0.26em] uppercase text-[10px] mb-4">
              Collections
            </p>
            <Link to="/collections/fw-2025" className="hover:text-neutral-200 transition block text-neutral-400">F/W 2025</Link>
            <Link to="/collections/sea" className="hover:text-neutral-200 transition block text-neutral-400">SEA</Link>
            <Link to="/collections/burmese" className="hover:text-neutral-200 transition block text-neutral-400">Burmese</Link>
            <Link to="/collections/lavish" className="hover:text-neutral-200 transition block text-neutral-400">Lavish</Link>
            <Link to="/authenticity" className="hover:text-neutral-200 transition block text-neutral-400">Authenticity</Link>
          </div>

          <div className="space-y-2.5">
            <p className="text-neutral-500 tracking-[0.26em] uppercase text-[10px] mb-4">
              Support
            </p>
            <Link to="/care" className="hover:text-neutral-200 transition block text-neutral-400">Care Guide</Link>
            <Link to="/faqs" className="hover:text-neutral-200 transition block text-neutral-400">FAQs</Link>
            <Link to="/returns" className="hover:text-neutral-200 transition block text-neutral-400">Shipping & Returns</Link>
            <Link to="/contact" className="hover:text-neutral-200 transition block text-neutral-400">Contact Us</Link>
            <Link to="/private-consult" className="hover:text-neutral-200 transition block text-neutral-400">Book a Consult</Link>
          </div>

          <div className="space-y-2.5">
            <p className="text-neutral-500 tracking-[0.26em] uppercase text-[10px] mb-4">
              {hasSocials ? "Connect" : "Company"}
            </p>
            {hasSocials ? (
              <>
                {SOCIAL.instagram && (
                  <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="hover:text-neutral-200 transition block text-neutral-400">
                    Instagram
                  </a>
                )}
                {SOCIAL.tiktok && (
                  <a href={SOCIAL.tiktok} target="_blank" rel="noreferrer" className="hover:text-neutral-200 transition block text-neutral-400">
                    TikTok
                  </a>
                )}
                {SOCIAL.youtube && (
                  <a href={SOCIAL.youtube} target="_blank" rel="noreferrer" className="hover:text-neutral-200 transition block text-neutral-400">
                    YouTube
                  </a>
                )}
              </>
            ) : null}
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="hover:text-neutral-200 transition block text-neutral-400"
            >
              Email Us
            </a>
            <Link to="/about" className="hover:text-neutral-200 transition block text-neutral-400">Our Story</Link>
            <Link to="/account" className="hover:text-neutral-200 transition block text-neutral-400">My Account</Link>
            <Link to="/partners" className="hover:text-neutral-200 transition block text-neutral-400">Partner Program</Link>
          </div>

        </div>

        {/* DIVIDER + LEGAL */}
        <div className="border-t border-neutral-800/60 mt-12 pt-7 text-center">
          <div className="flex flex-wrap gap-5 justify-center mb-5 text-[10px] text-neutral-600 uppercase tracking-[0.18em]">
            <Link to="/returns" className="hover:text-neutral-400 transition">Returns & Exchanges</Link>
            <Link to="/privacy" className="hover:text-neutral-400 transition">Privacy Policy</Link>
            <Link to="/privacy-choices" className="hover:text-neutral-400 transition">Your Privacy Choices</Link>
            <Link to="/terms" className="hover:text-neutral-400 transition">Terms & Conditions</Link>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase">
            &copy; {new Date().getFullYear()} {BRAND.fullName}. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
