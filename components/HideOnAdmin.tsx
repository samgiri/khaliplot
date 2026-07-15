"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public site chrome (header, footer, chatbox) on /admin routes so
 * the back-office renders as a standalone app, not nested in the marketing site.
 */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
