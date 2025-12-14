import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import gallerySections from "../data/gallerySections";

const FILTERS = {
  Texture: ["All", "BodyWave", "WaterWave", "DeepWave", "LooseWave", "Straight", "Curly"],
  Collection: ["All", "SEA", "Burmese", "Lavish", "Straight"],
  Colorway: ["All", "Natural", "613"],
};

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Texture");
  const [value, setValue] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const allItems = useMemo(
    () => gallerySections.flatMap((s) => s.items),
    []
  );

  useEffect(() => {
    const texture = searchParams.get("texture");
    const collection = searchParams.get("collection");
    const colorway = searchParams.get("colorway");

    if (texture) {
      setActiveFilter("Texture");
      setValue(texture);
    } else if (collection) {
      setActiveFilter("Collection");
      setValue(collection);
    } else if (colorway) {
      setActiveFilter("Colorway");
      setValue(colorway);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    if (value === "All") return allItems;
    const key = activeFilter.toLowerCase();
    return allItems.filter((item) => item[key] === value);
  }, [allItems, activeFilter, value]);

  return (
    <div className="pt-28 pb-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">

        {/* MOBILE FILTER BAR */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <p className="text-sm text-neutral-700">
            Filter: {activeFilter} — {value}
          </p>
          <button
            onClick={() => setFilterOpen(true)}
            className="text-xs uppercase tracking-[0.22em] border px-4 py-2 rounded-full"
          >
            Filters
          </button>
        </div>

        {/* DESKTOP FILTER TABS */}
        <div className="hidden lg:flex flex-wrap gap-6 mb-14 border-b border-neutral-200 pb-4">
          {Object.keys(FILTERS).map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setValue("All");
              }}
              className={`text-sm tracking-wide ${
                activeFilter === f
                  ? "text-neutral-900 border-b border-neutral-900"
                  : "text-neutral-500"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* DESKTOP FILTER VALUES */}
        <div className="hidden lg:flex flex-wrap gap-3 mb-12">
          {FILTERS[activeFilter].map((v) => (
            <button
              key={v}
              onClick={() => setValue(v)}
              className={`px-4 py-1.5 rounded-full text-[12px] tracking-[0.14em] border ${
                value === v
                  ? "bg-black text-white border-black"
                  : "border-neutral-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setLightbox(item)}
              className="group text-left"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(15,10,5,0.22)]">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm">{item.caption}</p>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <p className="text-sm">Filters</p>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {Object.keys(FILTERS).map((f) => (
              <div key={f} className="mb-6">
                <p className="text-xs uppercase tracking-[0.22em] mb-3 text-neutral-500">
                  {f}
                </p>
                <div className="flex flex-wrap gap-2">
                  {FILTERS[f].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setActiveFilter(f);
                        setValue(v);
                        setFilterOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full text-xs tracking-[0.14em] border ${
                        activeFilter === f && value === v
                          ? "bg-black text-white border-black"
                          : "border-neutral-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="relative max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightbox.src}
              alt=""
              className="w-full max-h-[80vh] object-contain bg-neutral-100"
            />
            <div className="p-6 flex justify-between">
              <p className="text-sm">{lightbox.caption}</p>
              {lightbox.productSlug && (
                <Link
                  to={`/products/${lightbox.productSlug}`}
                  className="text-xs uppercase tracking-[0.22em] border px-5 py-2 rounded-full"
                >
                  View Product
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
