import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  // Close dropdown on route change
  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  // Close on click outside or ESC
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpenMenu(null);
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
    >
      {label}
    </button>
  );

  return (
    <header
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 bg-[#FBF6EE]/95 backdrop-blur border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Left */}
          <nav className="flex items-center gap-6">
            {menuButton("Shop", "shop")}
            {menuButton("Collections", "collections")}
            <Link to="/gallery" className={linkClass}>
              Gallery
            </Link>
          </nav>

          {/* Center Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 tracking-[0.4em] text-sm text-black"
          >
            EMINENCE
          </Link>

          {/* Right */}
          <nav className="flex items-center gap-6">
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
            <Link to="/checkout">
              <ShoppingBag size={18} />
            </Link>
            <Link to="/account">
              <User size={18} />
            </Link>
          </nav>
        </div>

        {/* SHOP DROPDOWN */}
        {openMenu === "shop" && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5">
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

        {/* COLLECTIONS DROPDOWN */}
        {openMenu === "collections" && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-black/5">
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
    </header>
  );
}
