export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black placeholder-black/40 focus:outline-none focus:ring focus:ring-black/20 ${className}`}
      {...props}
    />
  );
}
