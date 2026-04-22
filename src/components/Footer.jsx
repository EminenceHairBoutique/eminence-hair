// src/components/Footer.jsx — Luxury Editorial Footer

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { BRAND, SOCIAL } from "../config/brand";
import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-[#F9F7F4] pt-14 pb-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* TOP SECTION — LOGO + SLOGAN */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="tracking-[0.35em] text-[13px] font-light uppercase">
              {BRAND.fullName}
            </span>
          </div>
          <p className="max-w-md text-[11px] text-neutral-500 leading-relaxed">
            Luxury human hair, crafted in our partner atelier.
            Designed for women who expect their hair to perform like couture.
          </p>
        </div>

        {/* MIDDLE SECTION — 5 COLUMNS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 text-center text-[12px] tracking-wide">

          <div className="space-y-2">
            <p className="text-neutral-600 tracking-[0.22em] uppercase text-[11px] mb-3">
              Shop
            </p>
            <Link to="/shop" className="hover:text-neutral-200 transition block">All Products</Link>
            <Link to="/shop/preorders" className="hover:text-neutral-200 transition block">Pre-Orders</Link>
            <Link to="/ready-to-ship" className="hover:text-neutral-200 transition block">Ready-to-Ship</Link>
            <Link to="/shop/wigs" className="hover:text-neutral-200 transition block">Wigs</Link>
            <Link to="/shop/bundles" className="hover:text-neutral-200 transition block">Bundles</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-600 tracking-[0.22em] uppercase text-[11px] mb-3">
              Collections
            </p>
            <Link to="/collections/fw-2025" className="hover:text-neutral-200 transition block">F/W 2025</Link>
            <Link to="/collections/sea" className="hover:text-neutral-200 transition block">SEA</Link>
            <Link to="/collections/burmese" className="hover:text-neutral-200 transition block">Burmese</Link>
            <Link to="/collections/lavish" className="hover:text-neutral-200 transition block">Lavish</Link>
            <Link to="/authenticity" className="hover:text-neutral-200 transition block">Authenticity</Link>
            <Link to="/shop?collection=eminence-essentials" className="hover:text-neutral-200 transition block">Eminence Essentials</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-600 tracking-[0.22em] uppercase text-[11px] mb-3">
              Client Services
            </p>
            <Link to="/care" className="hover:text-neutral-200 transition block">Care Guide</Link>
            <Link to="/faqs" className="hover:text-neutral-200 transition block">FAQs</Link>
            <Link to="/returns" className="hover:text-neutral-200 transition block">Shipping & Returns</Link>
            <Link to="/contact" className="hover:text-neutral-200 transition block">Client Services</Link>
            <Link to="/private-consult" className="hover:text-neutral-200 transition block">Book a Consult</Link>
            <Link to="/about" className="hover:text-neutral-200 transition block">About Us</Link>
            <Link to="/medical-hair" className="hover:text-neutral-200 transition block">Medical Hair</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-600 tracking-[0.22em] uppercase text-[11px] mb-3">
              For Professionals
            </p>
            <Link to="/for-professionals" className="hover:text-neutral-200 transition block">Overview</Link>
            <Link to="/partners" className="hover:text-neutral-200 transition block">Partner Program</Link>
            <Link to="/partners/stylists" className="hover:text-neutral-200 transition block">Stylist Program</Link>
            <Link to="/partners/creators" className="hover:text-neutral-200 transition block">Creator Program</Link>
            <Link to="/installers" className="hover:text-neutral-200 transition block">Installer Directory</Link>
            <Link to="/partners/portal" className="hover:text-neutral-200 transition block">Partner Portal</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-600 tracking-[0.22em] uppercase text-[11px] mb-3">
              Connect
            </p>
            {SOCIAL.instagram && (
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-200 transition block"
              >
                Instagram
              </a>
            )}
            {SOCIAL.tiktok && (
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-200 transition block"
              >
                TikTok
              </a>
            )}
            {SOCIAL.youtube && (
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-200 transition block"
              >
                YouTube
              </a>
            )}
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="hover:text-neutral-200 transition block"
            >
              {BRAND.supportEmail}
            </a>
            <Link to="/account" className="hover:text-neutral-200 transition block">My Account</Link>
            <SocialLinks
              variant="icon"
              iconSize={16}
              className="mt-3 gap-5"
              linkClassName="text-neutral-400 hover:text-[#D4AF37]"
            />
          </div>

        </div>

        {/* DIVIDER + LEGAL */}
        <div className="border-t border-neutral-800 mt-10 pt-6 text-center">
          <div className="flex flex-wrap gap-4 justify-center mb-4 text-[11px] text-neutral-600">
            <Link to="/returns" className="hover:text-neutral-400 transition">Returns & Exchanges</Link>
            <Link to="/privacy" className="hover:text-neutral-400 transition">Privacy Policy</Link>
            <Link to="/privacy-choices" className="hover:text-neutral-400 transition">Your Privacy Choices</Link>
            <Link to="/terms" className="hover:text-neutral-400 transition">Terms &amp; Conditions</Link>
          </div>
          <p className="text-[11px] tracking-wide text-neutral-500">
            &copy; {new Date().getFullYear()} {BRAND.fullName}. All Rights Reserved.
          </p>
          <p className="mt-2 text-[11px] text-neutral-600">
            Secure checkout powered by Stripe. All transactions encrypted.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
