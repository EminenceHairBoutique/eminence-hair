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

  const [activeMenu, setActiveMenu] = useState(null); // 'shop' | 'about' | null
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  // Scroll-aware shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const shopSections = useMemo(
    () => [
      {
        title: "Shop",
        items: [
          { label: "All Products", href: "/shop" },
          { label: "Ready-to-Ship Edit", href: "/ready-to-ship" },
          { label: "Eminence Essentials", href: "/shop?collection=eminence-essentials" },
          { label: "HD Lace Wigs", href: "/shop/wigs" },
          { label: "Medical Grade Wigs", href: "/shop/medical" },
          { label: "Bundles", href: "/shop/bundles" },
          { label: "Pre-Orders", href: "/shop/preorders" },
        ],
      },
      {
        title: "Collections",
        items: [
          { label: "Eminence Collection", href: "/collections/eminence" },
          { label: "SEA Collection", href: "/collections/sea" },
          { label: "Burmese Collection", href: "/collections/burmese" },
          { label: "Lavish Collection", href: "/collections/lavish" },
        ],
      },
      {
        title: "Colorways",
        items: [
          { label: "Natural", href: "/collections/natural" },
          { label: "613 Blonde", href: "/collections/613" },
          { label: "Burgundy", href: "/collections/burgundy" },
          { label: "Blended", href: "/collections/blended" },
        ],
      },
      {
        title: "Services",
        items: [
          { label: "Private Consult", href: "/private-consult" },
          { label: "Medical Hair", href: "/medical-hair" },
          { label: "Custom Atelier", href: "/custom-atelier" },
          { label: "Authenticity", href: "/authenticity" },
        ],
      },
    ],
    []
  );

  const aboutSections = useMemo(
    () => [
      {
        title: "About Us",
        items: [
          { label: "Our Story", href: "/about" },
          { label: "Authenticity", href: "/authenticity" },
          { label: "Care Guide", href: "/care" },
        ],
      },
      {
        title: "Support",
        items: [
          { label: "FAQs", href: "/faqs" },
          { label: "Contact", href: "/contact" },
          { label: "Consult", href: "/private-consult" },
          { label: "Custom Atelier", href: "/custom-atelier" },
        ],
      },
      {
        title: "Specialty",
        items: [
          { label: "Medical Hair", href: "/medical-hair" },
          { label: "Book a Consult", href: "/private-consult" },
          { label: "Verify Your Unit", href: "/authenticity" },
        ],
      },
      {
        title: "Quick Links",
        items: [
          { label: "Collections", href: "/collections" },
          { label: "Shop Essentials", href: "/shop?collection=eminence-essentials" },
          { label: "Shop All", href: "/shop" },
          { label: "Partner Program", href: "/partners" },
          { label: "Stylist Program", href: "/partners/stylists" },
          { label: "Creator Program", href: "/partners/creators" },
          { label: "Partner Portal", href: "/partner-portal" },
        ],
      },
    ],
    []
  );

  const menuImage =
    activeMenu === "shop"
      ? "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp"
      : "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 bg-[#FBF6EE]/90 backdrop-blur-md border-b border-black/5 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_16px_rgba(15,10,5,0.08)]" : ""
      }`}
    >
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-[15px] tracking-[0.28em] uppercase text-neutral-900">
            {BRAND.name}
          </span>
          <span className="text-[10px] tracking-[0.24em] uppercase text-neutral-500 mt-1">
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

          <Link to="/start-here" className="hover:text-black transition">
            Start Here
          </Link>

          <Link to="/ready-to-ship" className="hover:text-black transition">
            Ready-to-Ship
          </Link>

          <button
            type="button"
            onClick={() => setActiveMenu((m) => (m === "about" ? null : "about"))}
            className={`inline-flex items-center gap-2 hover:text-black transition ${
              activeMenu === "about" ? "text-black" : ""
            }`}
          >
            About Us <ChevronDown size={14} className="opacity-70" />
          </button>
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
            className="hidden sm:inline-flex items-center justify-center p-2 rounded-full hover:bg-white/60 transition"
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
        sections={[...shopSections.slice(0, 2), ...aboutSections.slice(0, 2)]}
      />

    </header>
  );
}
