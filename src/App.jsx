import { Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

// Core pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Gallery from "./pages/Gallery";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";

// Trust & content
import Authenticity from "./pages/Authenticity";
import Care from "./pages/Care";
import About from "./pages/About";
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";

// Verification (QR)
import Verify from "./pages/Verify";

export default function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />

      <Routes>
        {/* Core */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/wigs" element={<Shop />} />
        <Route path="/shop/bundles" element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetail />} />

        {/* Gallery */}
        <Route path="/gallery" element={<Gallery />} />

        {/* Collections */}
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<CollectionDetail />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />

        {/* Account */}
        <Route path="/account" element={<Account />} />

        {/* Trust / Content */}
        <Route path="/authenticity" element={<Authenticity />} />
        <Route path="/care" element={<Care />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Verification */}
        <Route path="/verify" element={<Verify />} />

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

      <Footer />
    </>
  );
}
