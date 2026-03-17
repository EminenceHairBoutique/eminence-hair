import React, { Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useCart } from "./context/CartContext";
import DiscountModal from "./components/DiscountModal";
import CookieBanner from "./components/legal/CookieBanner";
import TrackingScripts from "./components/TrackingScripts";
import { lazyWithRetry } from "./utils/lazyWithRetry";
const CartDrawer = lazyWithRetry(() => import("./components/CartDrawer"));
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
const Home = lazyWithRetry(() => import("./pages/Home"));
const StartHere = lazyWithRetry(() => import("./pages/StartHere"));
const Shop = lazyWithRetry(() => import("./pages/Shop"));
const ReadyToShip = lazyWithRetry(() => import("./pages/ReadyToShip"));
const PartnerProgram = lazyWithRetry(() => import("./pages/PartnerProgram"));
const StylistApplication = lazyWithRetry(() => import("./pages/StylistApplication"));
const CreatorApplication = lazyWithRetry(() => import("./pages/CreatorApplication"));
const PartnerPortal = lazyWithRetry(() => import("./pages/PartnerPortal"));
const AdminPartners = lazyWithRetry(() => import("./pages/AdminPartners"));
const Consultation = lazyWithRetry(() => import("./pages/Consultation"));
const ProductDetail = lazyWithRetry(() => import("./pages/ProductDetail"));
const Gallery = lazyWithRetry(() => import("./pages/Gallery"));
const Collections = lazyWithRetry(() => import("./pages/Collections"));
const CollectionDetail = lazyWithRetry(() => import("./pages/CollectionDetail"));
const MedicalHair = lazyWithRetry(() => import("./pages/MedicalHair"));
const Checkout = lazyWithRetry(() => import("./pages/Checkout"));
const Success = lazyWithRetry(() => import("./pages/Success"));
const Cancel = lazyWithRetry(() => import("./pages/Cancel"));
const Account = lazyWithRetry(() => import("./pages/Account"));
const Authenticity = lazyWithRetry(() => import("./pages/Authenticity"));
const Care = lazyWithRetry(() => import("./pages/Care"));
const About = lazyWithRetry(() => import("./pages/About"));
const Faqs = lazyWithRetry(() => import("./pages/Faqs"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const CustomOrders = lazyWithRetry(() => import("./pages/CustomOrders"));
const PrivateConsult = lazyWithRetry(() => import("./pages/PrivateConsult"));
const CustomAtelier = lazyWithRetry(() => import("./pages/CustomAtelier"));
const Verify = lazyWithRetry(() => import("./pages/Verify"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const Privacy = lazyWithRetry(() => import("./pages/Privacy"));
const PrivacyChoices = lazyWithRetry(() => import("./pages/PrivacyChoices"));
const Terms = lazyWithRetry(() => import("./pages/Terms"));
const Returns = lazyWithRetry(() => import("./pages/Returns"));
const Installers = lazyWithRetry(() => import("./pages/Installers"));
const Cart = lazyWithRetry(() => import("./pages/Cart"));
const AtelierTryOn = lazyWithRetry(() => import("./pages/AtelierTryOn"));
const AtelierMirror = lazyWithRetry(() => import("./pages/AtelierMirror"));
const AtelierPreorder = lazyWithRetry(() => import("./pages/AtelierPreorder"));


export default function App() {
  useRouteAnalytics();
  const location = useLocation();
  const { isOpen: isCartOpen } = useCart();

  return (
    <>
      <TrackingScripts />
      <LiveChat />
      <Suspense fallback={null}>
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

        <ErrorBoundary locationKey={`${location.pathname}${location.search}`}>
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
                  "/partner-portal",
                  <PartnerRoute>
                    <PartnerPortal />
                  </PartnerRoute>,
                ],
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
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>

        <CookieBanner />
        <Footer />
      </div>
    </>
  );
}
