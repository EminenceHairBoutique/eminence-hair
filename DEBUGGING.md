# Debugging Guide

## iPhone / Mobile Debug Mode

When a runtime error is caught by the `ErrorBoundary` and you cannot access desktop DevTools (e.g., on an iPhone), you can enable **debug mode** to reveal the real error details directly on the error screen.

### How to enable

Append `?debug=1` to any URL where the error screen appears:

```
https://www.eminenceluxuryhair.com/?debug=1
https://eminenceluxuryhair.com/?debug=1
```

Both the `www` and apex domain forms are supported (append `?debug=1` to whichever URL is showing the error screen).

When the error boundary renders with this query parameter present, it will display:

- `error.name` — the error type (e.g., `ReferenceError`, `TypeError`)
- `error.message` — the human-readable error description
- `error.stack` — the best-effort stack trace (where available)
- `error.cause` — any chained cause, if present

### How to disable

Remove `?debug=1` from the URL (return to the normal URL). The debug block is **hidden by default** for all normal visitors.

> ⚠️ **Do not share URLs with `?debug=1` publicly.** The stack trace can reveal internal file paths and implementation details. Use it only for private debugging sessions and remove it from any screenshots or links shared externally.

---

## "Try again" button behavior

- **Chunk load errors** (e.g., `Failed to fetch dynamically imported module`, `ChunkLoadError`): clicking "Try again" performs a full `window.location.reload()` to fetch the latest bundle from the server.
- **All other errors**: clicking "Try again" resets the error boundary state and attempts to re-render the component tree.
