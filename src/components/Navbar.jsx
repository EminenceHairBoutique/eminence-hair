import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Close dropdown / mobile drawer on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on click outside or ESC
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const linkClass =
    "text-sm tracking-wide text-neutral-700 hover:text-black transition";

  const menuButton = (label, key) => (
    <button
      onClick={() => setOpenMenu(openMenu === key ? null : key)}
      className={`relative ${linkClass} ${
        openMenu === key
          ? "text-black after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-black"
          : ""
      }`}
      type="button"
    >
      {label}
    </button>
  );

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 bg-[#FBF6EE]/95 backdrop-blur border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top bar */}
        <div className="h-16 grid grid-cols-3 items-center">
          {/* Mobile left: hamburger */}
          <div className="md:hidden justify-self-start">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-neutral-800"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Desktop left nav */}
          <nav className="hidden md:flex items-center gap-6 justify-self-start">
            {menuButton("Shop", "shop")}
            {menuButton("Collections", "collections")}
            <Link to="/gallery" className={linkClass}>
              Gallery
            </Link>
          </nav>

          {/* Center logo */}
          <Link
            to="/"
            onClick={closeAll}
            className="justify-self-center tracking-[0.4em] text-sm text-black select-none"
            aria-label="Eminence Home"
          >
            EMINENCE
          </Link>

          {/* Right icons + links */}
          <div className="justify-self-end flex items-center gap-4 md:gap-6">
            {/* Desktop right links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/about" className={linkClass}>
                About
              </Link>
              <Link to="/care" className={linkClass}>
                Care
              </Link>
              <Link to="/authenticity" className={linkClass}>
                Authenticity
              </Link>
              <Link to="/faqs" className={linkClass}>
                FAQs
              </Link>
              <Link to="/contact" className={linkClass}>
                Contact
              </Link>
            </nav>

            {/* Icons (always visible) */}
            <Link to="/checkout" onClick={closeAll} aria-label="Shopping bag">
              <ShoppingBag size={18} />
            </Link>
            <Link to="/account" onClick={closeAll} aria-label="Account">
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* SHOP DROPDOWN (desktop only) */}
        {openMenu === "shop" && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5">
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-10 text-sm animate-dropdown-in">
              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">
                  SHOP
                </p>
                <Link to="/shop" className="block mb-2 hover:text-black">
                  All Products
                </Link>
                <Link to="/shop/wigs" className="block mb-2 hover:text-black">
                  Wigs
                </Link>
                <Link to="/shop/bundles" className="block hover:text-black">
                  Bundles & Extensions
                </Link>
              </div>

              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">
                  TEXTURES
                </p>
                {[
                  "BodyWave",
                  "WaterWave",
                  "DeepWave",
                  "LooseWave",
                  "Straight",
                ].map((t) => (
                  <Link
                    key={t}
                    to={`/gallery?texture=${t}`}
                    className="block mb-2 hover:text-black"
                  >
                    {t}
                  </Link>
                ))}
              </div>

              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">
                  COLORWAYS
                </p>
                <Link to="/gallery?colorway=Natural" className="block mb-2">
                  Natural
                </Link>
                <Link to="/gallery?colorway=613" className="block">
                  613 Blonde
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS DROPDOWN (desktop only) */}
        {openMenu === "collections" && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5">
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-2 gap-10 text-sm animate-dropdown-in">
              {[
                "SEA Collection",
                "Burmese Collection",
                "Lavish Collection",
                "Straight Collection",
              ].map((c) => (
                <Link
                  key={c}
                  to={`/collections/${c.toLowerCase().replace(/\s/g, "-")}`}
                  className="hover:text-black"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu overlay"
            onClick={closeAll}
          />
          <div className="absolute top-0 left-0 h-full w-[86%] max-w-sm bg-[#FBF6EE] shadow-2xl border-r border-black/10 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-600">
                Menu
              </p>
              <button
                type="button"
                onClick={closeAll}
                className="p-2 -mr-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Shop
                </p>
                <Link to="/shop" onClick={closeAll} className="block text-sm">
                  All Products
                </Link>
                <Link
                  to="/shop/wigs"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Wigs
                </Link>
                <Link
                  to="/shop/bundles"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Bundles & Extensions
                </Link>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Explore
                </p>
                <Link
                  to="/collections/sea-collection"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  SEA Collection
                </Link>
                <Link
                  to="/collections/burmese-collection"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Burmese Collection
                </Link>
                <Link
                  to="/collections/lavish-collection"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Lavish Collection
                </Link>
                <Link
                  to="/collections/straight-collection"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Straight Collection
                </Link>
                <Link to="/gallery" onClick={closeAll} className="block text-sm">
                  Gallery
                </Link>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Support
                </p>
                <Link to="/about" onClick={closeAll} className="block text-sm">
                  About
                </Link>
                <Link to="/care" onClick={closeAll} className="block text-sm">
                  Care
                </Link>
                <Link
                  to="/authenticity"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Authenticity
                </Link>
                <Link to="/faqs" onClick={closeAll} className="block text-sm">
                  FAQs
                </Link>
                <Link
                  to="/contact"
                  onClick={closeAll}
                  className="block text-sm"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 flex items-center gap-4">
              <Link to="/checkout" onClick={closeAll} className="flex items-center gap-2 text-sm">
                <ShoppingBag size={18} /> Bag
              </Link>
              <Link to="/account" onClick={closeAll} className="flex items-center gap-2 text-sm">
                <User size={18} /> Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
