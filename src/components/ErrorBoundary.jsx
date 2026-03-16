import React from "react";
import { Link } from "react-router-dom";

function isChunkLoadError(error) {
  if (!error) return false;
  const name = error.name || "";
  const message = error.message || "";
  return (
    name === "ChunkLoadError" ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Loading chunk") ||
    message.includes("Importing a module script failed")
  );
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

  componentDidUpdate(prevProps) {
    if (
      this.props.locationKey !== prevProps.locationKey &&
      this.state.hasError
    ) {
      this.setState({ hasError: false, error: null });
    }
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

    const params = new URLSearchParams(window.location.search);
    const debugMode =
      params.get("debug") === "1" || params.get("debug") === "true";

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

          <p className="mt-8 text-[11px] text-neutral-400">
            If this keeps happening, contact support.
          </p>

          {debugMode && this.state.error && (
            <pre className="mt-6 text-left text-[11px] whitespace-pre-wrap break-words bg-black/5 p-4 rounded-xl text-neutral-700">
              {[
                `name: ${this.state.error.name || ""}`,
                `message: ${this.state.error.message || ""}`,
                `stack:\n${this.state.error.stack || ""}`,
                this.state.error.cause
                  ? `cause: ${String(this.state.error.cause)}`
                  : null,
              ]
                .filter(Boolean)
                .join("\n\n")}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
