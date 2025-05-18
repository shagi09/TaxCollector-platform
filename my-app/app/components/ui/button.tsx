import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button className={`rounded px-4 py-2 font-semibold ${className}`} {...props}>
      {children}
    </button>
  );
}