import { useState } from "react";

const PLACEHOLDER_STYLE = {
  background: "linear-gradient(135deg, #F3EFE8 0%, #EBE3D7 100%)",
};

export default function LazyImage({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleError = () => {
    if (import.meta.env.DEV && src) {
      console.warn(`[LazyImage] Missing image: ${src}`);
    }
    setErrored(true);
    setLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 eminence-skeleton" />
      )}
      {errored ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={PLACEHOLDER_STYLE}
          aria-label={alt || "Image unavailable"}
        >
          <span className="text-[10px] tracking-[0.22em] uppercase text-neutral-400">
            Eminence
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
