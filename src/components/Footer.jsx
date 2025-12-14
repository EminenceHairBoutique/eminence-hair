// src/components/Footer.jsx — Luxury Editorial Footer

import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-[#F9F7F4] pt-16 pb-10 mt-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* TOP SECTION — LOGO + SLOGAN */}
        <div className="flex flex-col items-center text-center mb-14">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="tracking-[0.35em] text-sm font-light uppercase">
              Eminence Hair
            </span>
          </div>

          <p className="max-w-lg text-xs text-neutral-400 leading-relaxed">
            Luxury Raw Cambodian & SEA hair, crafted in our partner atelier.  
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
            <Link to="/shop?category=luxury-wigs" className="hover:text-neutral-200 block">Wigs</Link>
            <Link to="/shop?category=raw-bundles" className="hover:text-neutral-200 block">Bundles</Link>
            <Link to="/shop?category=closures" className="hover:text-neutral-200 block">Closures</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Collections
            </p>
            <Link to="/collections" className="hover:text-neutral-200 block">Seasonal</Link>
            <Link to="/shop?collection=cambodian-raw" className="hover:text-neutral-200 block">Cambodian Raw</Link>
            <Link to="/shop?collection=sea" className="hover:text-neutral-200 block">SEA Collection</Link>
            <Link to="/shop?collection=613" className="hover:text-neutral-200 block">613 / Blonde</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              About
            </p>
            <Link to="/about" className="hover:text-neutral-200 block">Our Story</Link>
            <Link to="/authenticity" className="hover:text-neutral-200 block">Authenticity</Link>
            <Link to="/care" className="hover:text-neutral-200 block">Care Guide</Link>
            <Link to="/faqs" className="hover:text-neutral-200 block">FAQs</Link>
          </div>

          <div className="space-y-2">
            <p className="text-neutral-500 tracking-[0.22em] uppercase text-[11px] mb-2">
              Connect
            </p>
            <a href="#" className="hover:text-neutral-200 block">Instagram</a>
            <a href="#" className="hover:text-neutral-200 block">TikTok</a>
            <Link to="/contact" className="hover:text-neutral-200 block">Contact</Link>
            <Link to="/account" className="hover:text-neutral-200 block">My Account</Link>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-neutral-800 mt-14 pt-8 text-center">
          <p className="text-xs tracking-wide text-neutral-400">
            © 2025 Eminence Hair Boutique. All Rights Reserved.
          </p>
          <p className="text-[11px] mt-1 text-neutral-500">
            Luxury Human Hair | HD Lace | Raw Cambodian & SEA Wigs
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
