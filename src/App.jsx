import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useCart } from "./context/CartContext";
import DiscountModal from "./components/DiscountModal";
import CookieBanner from "./components/legal/CookieBanner";
import TrackingScripts from "./components/TrackingScripts";
import EmailPopup from "./components/EmailPopup";
const CartDrawer = lazy(() => import("./components/CartDrawer"));
import useRouteAnalytics from "./hooks/useRouteAnalytics";


// Layout (unchanged)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Partner gating + optional partner chat
import PartnerRoute from "./components/PartnerRoute";
import AdminRoute from "./components/AdminRoute";
import LiveChat from "./components/LiveChat";

// Safety + loading
import ErrorBoundary from "./components/ErrorBoundary";
import RouteSkeleton from "./components/RouteSkeleton";

// 🔹 Lazy-loaded pages (same pages, no logic change)
const Home = lazy(() => import("./pages/Home"));
const StartHere = lazy(() => import("./pages/StartHere"));
const Shop = lazy(() => import("./pages/Shop"));
const ReadyToShip = lazy(() => import("./pages/ReadyToShip"));
const PartnerProgram = lazy(() => import("./pages/PartnerProgram"));
const StylistApplication = lazy(() => import("./pages/StylistApplication"));
const CreatorApplication = lazy(() => import("./pages/CreatorApplication"));
const PartnerPortal = lazy(() => import("./pages/PartnerPortal"));
const AdminPartners = lazy(() => import("./pages/AdminPartners"));
const Consultation = lazy(() => import("./pages/Consultation"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const MedicalHair = lazy(() => import("./pages/MedicalHair"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Success = lazy(() => import("./pages/Success"));
const Cancel = lazy(() => import("./pages/Cancel"));
const Account = lazy(() => import("./pages/Account"));
const Authenticity = lazy(() => import("./pages/Authenticity"));
const Care = lazy(() => import("./pages/Care"));
const About = lazy(() => import("./pages/About"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Contact = lazy(() => import("./pages/Contact"));
const CustomOrders = lazy(() => import("./pages/CustomOrders"));
const PrivateConsult = lazy(() => import("./pages/PrivateConsult"));
const CustomAtelier = lazy(() => import("./pages/CustomAtelier"));
const Verify = lazy(() => import("./pages/Verify"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const PrivacyChoices = lazy(() => import("./pages/PrivacyChoices"));
const Terms = lazy(() => import("./pages/Terms"));
const Returns = lazy(() => import("./pages/Returns"));
const Installers = lazy(() => import("./pages/Installers"));
const Cart = lazy(() => import("./pages/Cart"));
const AtelierTryOn = lazy(() => import("./pages/AtelierTryOn"));
const AtelierMirror = lazy(() => import("./pages/AtelierMirror"));
const AtelierPreorder = lazy(() => import("./pages/AtelierPreorder"));


export default function App() {
  useRouteAnalytics();
  const location = useLocation();
  const { isOpen: isCartOpen } = useCart();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-neutral-900 focus:rounded-full focus:text-xs focus:tracking-widest focus:uppercase focus:shadow-lg"
      >
        Skip to main content
      </a>
      <TrackingScripts />
      <LiveChat />
      <Suspense fallback={<div className="hidden" aria-hidden="true" />}>
        <CartDrawer />
      </Suspense>
      {/* Everything except the drawer blurs/locks while cart is open */}
      <div
        className={`transition-all duration-300 ${
          isCartOpen ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <Navbar />
        <DiscountModal />
        <ScrollToTop />

        <ErrorBoundary>
          <main id="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {[
                ["/", <Home />],
                ["/start-here", <StartHere />],
                ["/ready-to-ship", <ReadyToShip />],
                ["/partners", <PartnerProgram />],
                ["/partners/stylists", <StylistApplication />],
                ["/partners/creators", <CreatorApplication />],
                [
                  "/partners/portal",
                  <PartnerRoute>
                    <PartnerPortal />
                  </PartnerRoute>,
                ],
                [
                  "/admin/partners",
                  <AdminRoute>
                    <AdminPartners />
                  </AdminRoute>,
                ],
                ["/consultation", <Consultation />],
                ["/shop", <Shop />],
                ["/shop/wigs", <Shop />],
                ["/shop/bundles", <Shop />],
                ["/shop/closures", <Shop />],
                ["/shop/medical", <Shop />],
                ["/shop/preorders", <Shop />],
                ["/products/:slug", <ProductDetail />],
                ["/gallery", <Gallery />],
                ["/collections", <Collections />],
                ["/collections/:slug", <CollectionDetail />],
                ["/checkout", <Checkout />],
                ["/success", <Success />],
                ["/cancel", <Cancel />],
                ["/account", <Account />],
                ["/authenticity", <Authenticity />],
                ["/care", <Care />],
                ["/about", <About />],
                ["/medical-hair", <MedicalHair />],
                ["/faqs", <Faqs />],
                ["/contact", <Contact />],
                ["/custom-orders", <CustomOrders />],
                ["/custom-atelier", <CustomAtelier />],
                ["/custom-wig", <CustomAtelier />],
                // Backwards compatibility for older /custom links
                ["/custom", <CustomOrders />],
                ["/private-consult", <PrivateConsult />],
                ["/privacy", <Privacy />],
                ["/privacy-choices", <PrivacyChoices />],
                ["/terms", <Terms />],
                ["/returns", <Returns />],
                ["/installers", <Installers />],
                ["/cart", <Cart />],
                ["/atelier/try-on", <AtelierTryOn />],
                ["/atelier/mirror", <AtelierMirror />],
                ["/atelier/preorder", <AtelierPreorder />],
                ["/preorder", <AtelierPreorder />],
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
              <Route path="/checkout/success" element={<Navigate to="/success" replace />} />
              <Route path="/order-confirmation" element={<Navigate to="/success" replace />} />
              <Route path="/medical" element={<Navigate to="/medical-hair" replace />} />
              <Route path="/help" element={<Navigate to="/faqs" replace />} />
              <Route path="/shipping-returns" element={<Navigate to="/returns" replace />} />
              <Route path="/partner-portal" element={<Navigate to="/partners/portal" replace />} />
            </Routes>
          </AnimatePresence>
          </main>
        </ErrorBoundary>

        <CookieBanner />
        <EmailPopup />
        <Footer />
      </div>
    </>
  );
}
