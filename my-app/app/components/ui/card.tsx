import React from "react";

export function Card({ children, ...props }) {
  return <div {...props} className="rounded-lg border bg-white shadow">{children}</div>;
}

export function CardContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}