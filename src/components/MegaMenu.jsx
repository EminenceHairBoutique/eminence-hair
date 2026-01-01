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
          className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl
                     border-t border-neutral-200 shadow-[0_16px_40px_rgba(0,0,0,0.10)]
                     z-[999] pt-8 pb-12"
        >
          <div className="max-w-7xl mx-auto px-10 grid grid-cols-5 gap-14">
            {/* MENU COLUMNS */}
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.20em] text-neutral-500">
                  {section.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {section.items?.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between text-sm
                                 text-neutral-700 hover:text-black transition"
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
                        <span>{item.label}</span>
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
              <div className="col-span-1 hidden md:block">
                <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-lg">
                  <img
                    src={image}
                    alt="Featured"
                    className="w-full h-64 object-cover"
                  />
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
