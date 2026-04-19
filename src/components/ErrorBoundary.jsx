import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  handleReset = () => {
    const isChunkError =
      this.state.error?.name === 'ChunkLoadError' ||
      /loading chunk \d+ failed/i.test(this.state.error?.message || '');

    if (isChunkError) {
      window.location.href = window.location.pathname + '?t=' + Date.now();
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const debugParam = new URLSearchParams(window.location.search).get('debug');
    const showDebug =
      (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
      debugParam === '1' || debugParam === 'true';

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

          {showDebug && this.state.error && (
            <div className="mt-8 text-left bg-white/60 rounded-2xl border border-neutral-200 p-6 overflow-auto max-h-80">
              <p className="text-xs font-mono text-red-700 mb-1"><b>name:</b> {this.state.error.name}</p>
              <p className="text-xs font-mono text-red-700 mb-1"><b>message:</b> {this.state.error.message}</p>
              {this.state.error.cause && (
                <p className="text-xs font-mono text-red-700 mb-2"><b>cause:</b> {String(this.state.error.cause)}</p>
              )}
              <pre className="text-[11px] font-mono text-neutral-600 whitespace-pre-wrap">{this.state.error.stack}</pre>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[11px] font-mono text-neutral-500 whitespace-pre-wrap mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          <p className="mt-8 text-[11px] text-neutral-400">
            If this keeps happening, contact support.
          </p>
        </div>
      </div>
    );
  }
}
