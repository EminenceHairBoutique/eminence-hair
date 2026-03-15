import React from "react";
import { Link } from "react-router-dom";

/** Returns true if the error looks like a Vite/webpack chunk load failure. */
function isChunkLoadError(error) {
  if (!error) return false;
  const msg = String(error?.message || error?.name || error || "").toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("importing a module script failed") ||
    msg.includes("chunkloaderror") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    /loading .* chunk \d+ failed/i.test(msg)
  );
}

const CHUNK_RELOAD_KEY = "eminence_chunk_reload_attempted";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = isChunkLoadError(error);
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error, _info) {
    // Auto-reload once on chunk load errors to clear stale assets.
    if (isChunkLoadError(error)) {
      const alreadyReloaded =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(CHUNK_RELOAD_KEY);
      if (!alreadyReloaded) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
          window.location.reload();
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    // Reset error state when the route changes so the new route gets a
    // fresh render attempt rather than staying stuck on the error screen.
    if (
      this.state.hasError &&
      prevProps.locationKey !== this.props.locationKey
    ) {
      this.setState({ hasError: false, error: null, isChunkError: false });
    }
  }

  handleReset = () => {
    if (this.state.isChunkError) {
      // For chunk errors, a simple state reset won't work because React.lazy
      // caches the rejected promise. Force a full reload instead.
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        window.location.reload();
      }
      return;
    }
    this.setState({ hasError: false, error: null, isChunkError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[70vh] pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
            Eminence Hair
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-wide">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            A page error occurred. Your cart and browsing session are safe.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-7 py-3 rounded-full text-[11px] tracking-[0.26em] uppercase bg-neutral-900 text-[#F9F7F4] hover:bg-black transition"
            >
              Try again
            </button>

            <Link
              to="/"
              className="px-7 py-3 rounded-full text-[11px] tracking-[0.26em] uppercase border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
            >
              Return home
            </Link>
          </div>

          {/* Keep details hidden unless you want dev info */}
          <p className="mt-8 text-[11px] text-neutral-400">
            If this keeps happening, contact support.
          </p>
        </div>
      </div>
    );
  }
}
