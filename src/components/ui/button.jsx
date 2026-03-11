import * as React from "react";

export function Button({
  className = "",
  variant = "default",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4AF37]/60 " +
    "disabled:opacity-50 disabled:pointer-events-none " +
    "transition-all duration-200 active:scale-[0.98]";
  const variants = {
    default:
      "bg-black text-white hover:bg-black/80 hover:-translate-y-px hover:shadow-md",
    outline:
      "border border-black/20 bg-transparent text-black hover:bg-black/5 hover:-translate-y-px",
    secondary:
      "bg-gray-200 text-black hover:bg-gray-300 hover:-translate-y-px",
    ghost:
      "bg-transparent text-black hover:bg-black/5",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
    icon: "h-9 w-9",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
