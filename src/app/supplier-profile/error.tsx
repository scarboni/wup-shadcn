// DEPRECATED: This route is a duplicate of /supplier.
// Delete this entire directory when possible.
"use client";

export default function DeprecatedError() {
  if (typeof window !== "undefined") window.location.replace("/supplier");
  return null;
}
