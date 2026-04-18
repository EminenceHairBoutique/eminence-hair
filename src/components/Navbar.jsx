import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ChevronDown, Search, Menu, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import MegaMenu from "./MegaMenu";
import AnnouncementBar from "./AnnouncementBar";
import SearchModal from "./SearchModal";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { BRAND } from "../config/brand";

export default function Navbar() {
  const { items, openCart } = useCart();
  const { user } = useUser();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState(null); // 'shop' | 'about' | 'services' | null
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef(null);

  // Close dropdowns on navigation
  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  // Click outside + Escape closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    const onClick = (e) => {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target)) setActiveMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const shopSections = useMemo(() => [
    {
      title: "By Type",
      items: [
        { label: "All Products", href: "/shop" },
        { label: "HD Lace Wigs", href: "/shop/wigs" },
        { label: "Bundles", href: "/shop/bundles" },
        { label: "Closures & Frontals", href: "/shop/closures" },
      ],
    },
    {
      title: "Featured",
      items: [
        { label: "Eminence Essentials", href: "/shop?collection=eminence-essentials" },
        { label: "Pre-Orders", href: "/shop/preorders" },
      ],
    },
    {
      title: "Quick Access",
      items: [
        { label: "Ready-to-Ship", href: "/ready-to-ship" },
        { label: "Medical Grade", href: "/shop/medical" },
      ],
    },
  ], []);

  const servicesSections = useMemo(() => [
    {
      title: "Concierge",
      items: [
        { label: "Private Consult", href: "/private-consult" },
        { label: "Medical Hair", href: "/medical-hair" },
      ],
    },
    {
      title: "Atelier",
      items: [
        { label: "Custom Atelier", href: "/custom-atelier" },
        { label: "Atelier Try-On", href: "/atelier/try-on" },
        { label: "Atelier Pre-Order", href: "/atelier/preorder" },
        { label: "Authenticity", href: "/authenticity" },
      ],
    },
  ], []);

  const aboutSections = useMemo(() => [
    {
      title: "Our Brand",
      items: [
        { label: "Our Story", href: "/about" },
        { label: "Gallery", href: "/gallery" },
        { label: "Installers", href: "/installers" },
      ],
    },
    {
      title: "Help",
      items: [
        { label: "FAQs", href: "/faqs" },
        { label: "Care Guide", href: "/care" },
        { label: "Shipping & Returns", href: "/shipping" },
        { label: "Client Services", href: "/contact" },
      ],
    },
  ], []);

  const menuImage =
    activeMenu === "shop"
      ? "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp"
      : activeMenu === "services"
        ? "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
        : "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 bg-[#FBF6EE]/90 backdrop-blur-md border-b border-black/5"
    >
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-[15px] tracking-[0.28em] uppercase text-neutral-900">
            {BRAND.name}
          </span>
          <span className="text-[10px] tracking-[0.24em] uppercase text-neutral-600 mt-1">
            {BRAND.tagline}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9 text-[11px] uppercase tracking-[0.22em] text-neutral-800">
          <button
            type="button"
            onClick={() => setActiveMenu((m) => (m === "shop" ? null : "shop"))}
            className={`inline-flex items-center gap-2 hover:text-black transition ${
              activeMenu === "shop" ? "text-black" : ""
            }`}
          >
            Shop <ChevronDown size={14} className="opacity-70" />
          </button>

          <Link to="/collections" className="hover:text-black transition">
            Collections
          </Link>

          <button
            type="button"
            onClick={() => setActiveMenu((m) => (m === "services" ? null : "services"))}
            className={`inline-flex items-center gap-2 hover:text-black transition ${
              activeMenu === "services" ? "text-black" : ""
            }`}
          >
            Atelier <ChevronDown size={14} className="opacity-70" />
          </button>

          <button
            type="button"
            onClick={() => setActiveMenu((m) => (m === "about" ? null : "about"))}
            className={`inline-flex items-center gap-2 hover:text-black transition ${
              activeMenu === "about" ? "text-black" : ""
            }`}
          >
            About Us <ChevronDown size={14} className="opacity-70" />
          </button>

          <Link to="/journal" className="hover:text-black transition">
            Journal
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveMenu(null);
              setMobileOpen(true);
            }}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full hover:bg-white/60 transition"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-neutral-800" />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-white/60 transition"
            aria-label="Search products"
          >
            <Search size={18} className="text-neutral-800" />
          </button>

          <Link
            to="/private-consult"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/40 hover:bg-white/70 transition"
          >
            Consult
          </Link>

          <Link
            to="/account"
            className="relative p-2 rounded-full hover:bg-white/60 transition"
            aria-label={user ? "My account" : "Sign in"}
            title={user ? "My account" : "Sign in"}
          >
            <User size={20} className="text-neutral-800" />
            {user && (
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FBF6EE]"
                aria-hidden="true"
              />
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-white/60 transition"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} className="text-neutral-800" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-[#FBF6EE] text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega Menus */}
      <MegaMenu
        open={activeMenu === "shop"}
        onClose={() => setActiveMenu(null)}
        sections={shopSections}
        image={menuImage}
      />
      <MegaMenu
        open={activeMenu === "about"}
        onClose={() => setActiveMenu(null)}
        sections={aboutSections}
        image={menuImage}
      />
      <MegaMenu
        open={activeMenu === "services"}
        onClose={() => setActiveMenu(null)}
        sections={servicesSections}
        image={menuImage}
      />

      {/* Search */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      <MobileMenuDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSearch={() => {
          setMobileOpen(false);
          setSearchOpen(true);
        }}
        sections={[...shopSections, ...servicesSections, ...aboutSections]}
      />

    </header>
  );
}
