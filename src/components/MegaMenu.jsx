// src/components/MegaMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const MegaMenu = ({ open, onClose, sections, image }) => {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full bg-[#FBF6EE]/96 backdrop-blur-xl
                     border-t border-black/10 shadow-[0_18px_50px_rgba(10,10,10,0.14)]
                     z-[999] pt-7 pb-10"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* MENU COLUMNS */}
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                  {section.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {section.items?.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between text-[13px] font-light
                                 text-neutral-800 hover:text-black transition"
                    >
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <div className="h-8 w-8 rounded-full overflow-hidden border border-neutral-200 shadow-sm">
                            <img
                              src={item.thumbnail}
                              alt={item.label}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <span className="tracking-[0.01em]">{item.label}</span>
                      </div>
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* FEATURED IMAGE */}
            {image && (
              <div className="hidden md:block">
                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-[0_20px_55px_rgba(15,10,5,0.20)]">
                  <img
                    src={image}
                    alt="Featured"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-black/10 bg-white/50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                    New to wigs?
                  </p>
                  <p className="mt-2 text-sm text-neutral-900">
                    Take the guided Matchmaker and shop with confidence.
                  </p>
                  <Link
                    to="/start-here"
                    onClick={onClose}
                    className="mt-3 inline-block text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
                  >
                    Start Here
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
