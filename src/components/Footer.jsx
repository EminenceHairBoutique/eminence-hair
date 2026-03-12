// src/components/Footer.jsx — Luxury Editorial Footer

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { BRAND, SOCIAL } from "../config/brand";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-[#F9F7F4] pt-16 pb-10 mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* TOP SECTION — LOGO + SLOGAN */}
        <div className="flex flex-col items-center text-center mb-14">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="tracking-[0.35em] text-sm font-light uppercase">
              {BRAND.fullName}
            </span>
          </div>

          <p className="max-w-lg text-xs text-neutral-400 leading-relaxed">
            Luxury human hair, crafted in our partner atelier.
            Designed for women who expect their hair to perform like couture.
          </p>
        </div>

        {/* MIDDLE SECTION — LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-center text-[12px] tracking-wide">

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Shop
            </p>
            <Link to="/shop" className="hover:text-neutral-200 block">All Products</Link>
            <Link to="/shop/preorders" className="hover:text-neutral-200 block">Pre-Orders</Link>
            <Link to="/ready-to-ship" className="hover:text-neutral-200 block">Ready-to-Ship</Link>
            <Link to="/shop/wigs" className="hover:text-neutral-200 block">Wigs</Link>
            <Link to="/shop/bundles" className="hover:text-neutral-200 block">Bundles</Link>
            <Link to="/shop?collection=eminence-essentials" className="hover:text-neutral-200 block">Eminence Essentials</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Collections
            </p>
            <Link to="/collections/fw-2025" className="hover:text-neutral-200 block">F/W 2025</Link>
            <Link to="/collections/sea" className="hover:text-neutral-200 block">SEA</Link>
            <Link to="/collections/burmese" className="hover:text-neutral-200 block">Burmese</Link>
            <Link to="/collections/lavish" className="hover:text-neutral-200 block">Lavish</Link>
            <Link to="/collections/613" className="hover:text-neutral-200 block">613</Link>
            <Link to="/authenticity" className="hover:text-neutral-200 block">Authenticity</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Help
            </p>
            <Link to="/care" className="hover:text-neutral-200 block">Care Guide</Link>
            <Link to="/faqs" className="hover:text-neutral-200 block">FAQs</Link>
            <Link to="/returns" className="hover:text-neutral-200 block">Shipping & Returns</Link>
            <Link to="/contact" className="hover:text-neutral-200 block">Contact</Link>
            <Link to="/private-consult" className="hover:text-neutral-200 block">Book a Consult</Link>
            <Link to="/partners" className="hover:text-neutral-200 block">Partner Program</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Connect
            </p>
            {SOCIAL.instagram && (
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-200 block"
              >
                Instagram
              </a>
            )}
            {SOCIAL.tiktok && (
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-200 block"
              >
                TikTok
              </a>
            )}
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="hover:text-neutral-200 block"
            >
              {BRAND.supportEmail}
            </a>
            <Link to="/account" className="hover:text-neutral-200 block">My Account</Link>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-neutral-800 mt-14 pt-8 text-center">
          <p className="text-xs tracking-wide text-neutral-400">
            © {new Date().getFullYear()} {BRAND.fullName}. All Rights Reserved.
          </p>
          <p className="text-[11px] mt-1 text-neutral-500">
            Luxury Human Hair | HD Lace | Crafted to last
          </p>
        </div>

        <div className="mt-4 text-sm text-neutral-600 flex flex-wrap gap-4 justify-center">
          <Link to="/returns" className="hover:text-neutral-300 transition">Returns & Exchanges</Link>
          <Link to="/privacy" className="hover:text-neutral-300 transition">Privacy Policy</Link>
          <Link to="/privacy-choices" className="hover:text-neutral-300 transition">Your Privacy Choices</Link>
          <Link to="/terms" className="hover:text-neutral-300 transition">Terms & Conditions</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
