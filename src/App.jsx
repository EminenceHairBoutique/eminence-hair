import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useCart } from "./context/CartContext";
import DiscountModal from "./components/DiscountModal";
import CookieBanner from "./components/legal/CookieBanner";
const CartDrawer = lazy(() => import("./components/CartDrawer"));
import useRouteAnalytics from "./hooks/useRouteAnalytics";


// Layout (unchanged)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Safety + loading
import ErrorBoundary from "./components/ErrorBoundary";
import RouteSkeleton from "./components/RouteSkeleton";

// 🔹 Lazy-loaded pages (same pages, no logic change)
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Account = lazy(() => import("./pages/Account"));
const Authenticity = lazy(() => import("./pages/Authenticity"));
const Care = lazy(() => import("./pages/Care"));
const About = lazy(() => import("./pages/About"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Contact = lazy(() => import("./pages/Contact"));
const Verify = lazy(() => import("./pages/Verify"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));


export default function App() {
  useRouteAnalytics();
  const location = useLocation();
  const { isOpen: isCartOpen } = useCart();

  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
      <DiscountModal />
      <ScrollToTop />

      {/* GLOBAL PAGE BLUR WHEN CART OPEN */}
      <div
        className={`transition-all duration-300 ${
          isCartOpen ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {[
                ["/", <Home />],
                ["/shop", <Shop />],
                ["/shop/wigs", <Shop />],
                ["/shop/bundles", <Shop />],
                ["/products/:slug", <ProductDetail />],
                ["/gallery", <Gallery />],
                ["/collections", <Collections />],
                ["/collections/:slug", <CollectionDetail />],
                ["/checkout", <Checkout />],
                ["/order-confirmation", <OrderConfirmation />],
                ["/account", <Account />],
                ["/authenticity", <Authenticity />],
                ["/care", <Care />],
                ["/about", <About />],
                ["/faqs", <Faqs />],
                ["/contact", <Contact />],
                ["/privacy", <Privacy />],
                ["/terms", <Terms />],
                ["/verify", <Verify />],
                ["*", <NotFound />],
              ].map(([path, element]) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <Suspense fallback={<RouteSkeleton />}>
                        {element}
                      </Suspense>
                    </Motion.div>
                  }
                />
              ))}

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <div className="pt-40 pb-40 text-center">
                    <h1 className="text-2xl font-light">Page not found</h1>
                  </div>
                }
              />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </div>

      <CookieBanner />
      <Footer />
    </>
  );
}
