import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Web Vitals → GA4 (non-blocking)
try {
  import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const send = ({ name, delta, id }) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, {
          event_category: "Web Vitals",
          value: Math.round(name === "CLS" ? delta * 1000 : delta),
          event_label: id,
          non_interaction: true,
        });
      }
    };
    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  }).catch(() => {});
} catch (_e) {
  // web-vitals not critical
}
