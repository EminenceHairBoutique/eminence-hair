import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

// Activate Google Fonts (replaces inline onload handler for CSP compliance)
try {
  const gf = document.getElementById('eminence-gfonts');
  if (gf) gf.media = 'all';
} catch (_) { /* ignore */ }

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
