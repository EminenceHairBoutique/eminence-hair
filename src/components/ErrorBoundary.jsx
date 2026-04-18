import React from "react";
import { Link } from "react-router-dom";

const IS_DEBUG =
  typeof window !== "undefined" &&
  (import.meta.env.DEV ||
    new URLSearchParams(window.location.search).has("debug"));

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ errorInfo: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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

          {IS_DEBUG && this.state.error && (
            <details className="mt-10 text-left text-xs text-neutral-600 bg-white/60 rounded-xl p-4 border border-neutral-200">
              <summary className="cursor-pointer font-medium text-neutral-800 mb-2">
                Debug Info (visible in dev or ?debug=1)
              </summary>
              <pre className="whitespace-pre-wrap break-words text-red-700 mb-2">
                {String(this.state.error)}
              </pre>
              {this.state.errorInfo?.componentStack && (
                <pre className="whitespace-pre-wrap break-words text-neutral-500">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}

          <p className="mt-8 text-[11px] text-neutral-400">
            If this keeps happening, contact support.
          </p>
        </div>
      </div>
    );
  }
}
