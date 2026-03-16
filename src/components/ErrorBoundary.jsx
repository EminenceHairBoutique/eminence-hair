import React from "react";
import { Link } from "react-router-dom";

/** Returns true when the error looks like a failed dynamic-import / chunk load. */
function isChunkLoadError(error) {
  if (!error) return false;
  const name = error.name || "";
  const message = error.message || "";
  return (
    name === "ChunkLoadError" ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Importing a module script failed")
  );
}

/** Returns true when the current URL contains debug=1 or debug=true. */
function isDebugMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const val = params.get("debug");
    return val === "1" || val === "true";
  } catch {
    return false;
  }
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(_error, _info) {
    // Optional: send to logging later (Sentry/LogRocket)
    // console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    if (isChunkLoadError(this.state.error)) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error } = this.state;
    const showDebug = isDebugMode();

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

          {showDebug && error && (
            <div className="mt-6 text-left">
              <pre className="text-[11px] whitespace-pre-wrap break-words bg-black/5 p-4 rounded-xl text-neutral-700 leading-relaxed">
                {[
                  error.name ? `name: ${String(error.name)}` : null,
                  error.message ? `message: ${String(error.message)}` : null,
                  error.stack ? `\nstack:\n${String(error.stack)}` : null,
                  error.cause ? `\ncause: ${String(error.cause)}` : null,
                ]
                  .filter(Boolean)
                  .join("\n")}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }
}
