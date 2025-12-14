import React from "react";

export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-playfair mb-4 text-[#D4AF37]">404</h1>
      <p className="text-lg mb-6">Even perfection can get lost in the weave.</p>
      <a href="/" className="underline text-[#D4AF37]">Return Home</a>
    </div>
  );
}
