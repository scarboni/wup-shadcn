"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", marginBottom: "0.5rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", maxWidth: "28rem" }}>
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={reset}
            style={{ padding: "0.625rem 1.5rem", backgroundColor: "#f97316", color: "#fff", fontSize: "0.875rem", fontWeight: 600, borderRadius: "0.5rem", border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
