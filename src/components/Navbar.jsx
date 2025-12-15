import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const location = useLocation();

  const isHome = location.pathname === "/";

  /* ─────────────────────────────
     Scroll-based header behavior
  ───────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─────────────────────────────
     Lock body scroll when mobile menu is open
  ───────────────────────────── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ─────────────────────────────
     Close menus on route change
  ───────────────────────────── */
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  /* ─────────────────────────────
     Outside click + ESC
  ───────────────────────────── */
    useEffect(() => {
      function handleClick(e) {
        // On mobile, let the overlay + links handle closing
        if (mobileOpen) return;

        if (navRef.current && !navRef.current.contains(e.target)) {
          setOpenMenu(null);
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
    }, [mobileOpen]);

  /* ─────────────────────────────
     Desktop hover helpers
  ───────────────────────────── */
  const openWithHover = (key) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };

  const closeWithDelay = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 120);
  };

  const closeAll = () => {
    clearTimeout(closeTimer.current);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const linkClass =
    "text-sm tracking-wide text-neutral-700 hover:text-black transition";

  const menuButton = (label, key) => (
    <button
      type="button"
      onMouseEnter={() => openWithHover(key)}
      onMouseLeave={closeWithDelay}
      onClick={() => setOpenMenu(openMenu === key ? null : key)}
      className={`relative ${linkClass} ${
        openMenu === key
          ? "text-black after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:bg-black"
          : ""
      }`}
    >
      {label}
    </button>
  );

  const headerBg =
    isHome && !scrolled
      ? "bg-[#FBF6EE]"
      : "bg-[#FBF6EE]/95 backdrop-blur";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b border-black/5 transition-colors duration-300 ${headerBg}`}
    >
      <div ref={navRef} className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-16 grid grid-cols-3 items-center">
            {/* Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Desktop Left */}
            <nav className="hidden md:flex gap-6">
              {menuButton("Shop", "shop")}
              {menuButton("Collections", "collections")}
              <Link to="/gallery" className={linkClass}>
                Gallery
              </Link>
            </nav>

            {/* Logo */}
            <Link
              to="/"
              onClick={closeAll}
              className="justify-self-center tracking-[0.4em] text-sm text-black"
            >
              EMINENCE
            </Link>

            {/* Desktop Right */}
            <div className="justify-self-end flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <Link to="/about" className={linkClass}>About</Link>
                <Link to="/care" className={linkClass}>Care</Link>
                <Link to="/authenticity" className={linkClass}>Authenticity</Link>
                <Link to="/faqs" className={linkClass}>FAQs</Link>
                <Link to="/contact" className={linkClass}>Contact</Link>
              </nav>
              <Link to="/checkout"><ShoppingBag size={18} /></Link>
              <Link to="/account"><User size={18} /></Link>
            </div>
          </div>
        </div>

        {/* SHOP DROPDOWN */}
        {openMenu === "shop" && (
          <div
            onMouseEnter={() => openWithHover("shop")}
            onMouseLeave={closeWithDelay}
            className="hidden md:block absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5"
          >
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-10 text-sm">
              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">SHOP</p>
                <Link to="/shop" className="block mb-2">All Products</Link>
                <Link to="/shop/wigs" className="block mb-2">Wigs</Link>
                <Link to="/shop/bundles" className="block">Bundles & Extensions</Link>
              </div>
              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">TEXTURES</p>
                {["BodyWave","WaterWave","DeepWave","LooseWave","Straight"].map(t => (
                  <Link key={t} to={`/gallery?texture=${t}`} className="block mb-2">
                    {t}
                  </Link>
                ))}
              </div>
              <div>
                <p className="mb-3 text-xs tracking-widest text-neutral-500">COLORWAYS</p>
                <Link to="/gallery?colorway=Natural" className="block mb-2">Natural</Link>
                <Link to="/gallery?colorway=613" className="block">613 Blonde</Link>
              </div>
            </div>
          </div>
        )}

        {/* COLLECTIONS DROPDOWN */}
        {openMenu === "collections" && (
          <div
            onMouseEnter={() => openWithHover("collections")}
            onMouseLeave={closeWithDelay}
            className="hidden md:block absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5"
          >
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-2 gap-10 text-sm">
              <Link to="/collections/fw-2025">F/W 2025 Collection</Link>
              <Link to="/collections/eminence">Eminence Collection</Link>
              <Link to="/collections/sea">SEA Collection</Link>
              <Link to="/collections/613">613 Blonde Collection</Link>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            className="absolute inset-0 bg-black/40 touch-none"
            aria-label="Close menu overlay"
            onClick={closeAll}
          />

          <div className="absolute top-0 left-0 h-screen w-[86%] max-w-sm bg-[#FBF6EE] p-5 shadow-2xl overflow-y-auto overscroll-contain">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-600">
                Menu
              </p>
              <button onClick={closeAll}>
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 mb-3">Shop</p>
                <Link to="/shop" onClick={closeAll} className="block text-sm">All Products</Link>
                <Link to="/shop/wigs" onClick={closeAll} className="block text-sm">Wigs</Link>
                <Link to="/shop/bundles" onClick={closeAll} className="block text-sm">Bundles & Extensions</Link>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 mb-3">Explore</p>
                <Link to="/collections/fw-2025" onClick={closeAll} className="block text-sm">F/W 2025 Collection</Link>
                <Link to="/collections/eminence" onClick={closeAll} className="block text-sm">Eminence Collection</Link>
                <Link to="/collections/sea" onClick={closeAll} className="block text-sm">SEA Collection</Link>
                <Link to="/collections/613" onClick={closeAll} className="block text-sm">613 Blonde Collection</Link>
                <Link to="/gallery" onClick={closeAll} className="block text-sm">Gallery</Link>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 mb-3">Support</p>
                <Link to="/about" onClick={closeAll} className="block text-sm">About</Link>
                <Link to="/care" onClick={closeAll} className="block text-sm">Care</Link>
                <Link to="/authenticity" onClick={closeAll} className="block text-sm">Authenticity</Link>
                <Link to="/faqs" onClick={closeAll} className="block text-sm">FAQs</Link>
                <Link to="/contact" onClick={closeAll} className="block text-sm">Contact</Link>
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
