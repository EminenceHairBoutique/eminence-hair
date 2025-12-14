import React, { useState } from "react";

export default function Faqs() {
  const faqs = [
    { q: "Is Eminence Hair 100% raw?", a: "Yes, sourced from single donors and processed minimally for quality assurance." },
    { q: "Do you offer custom wigs?", a: "Absolutely. Each unit can be tailored for color, density, and lace preference." },
    { q: "What’s your shipping time?", a: "5–9 business days on preorders; 2–3 for ready-to-ship items." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-[#F9F7F4] min-h-screen p-10 text-[#1C1C1C]">
      <h1 className="text-4xl font-playfair text-center mb-10">FAQs</h1>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="border-b border-[#D4AF37]/20 pb-4">
            <button className="w-full text-left font-semibold text-lg flex justify-between"
              onClick={() => setOpen(open === i ? null : i)}>
              {f.q}
              <span>{open === i ? "-" : "+"}</span>
            </button>
            {open === i && <p className="mt-2 text-gray-600">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
