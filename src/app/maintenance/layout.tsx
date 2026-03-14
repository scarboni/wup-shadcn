/*  Maintenance layout — bypasses the main AppLayout (no header, no footer,
    no exit-intent popup, no auth providers).  The root layout.tsx still
    provides <html>, <body>, and globals.css. */

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
