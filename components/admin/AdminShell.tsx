"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/adminNav";

const INACTIVITY_MS = 15 * 60 * 1000; // auto-logout after 15 min idle
const THEME_KEY = "kp_admin_theme";

export default function AdminShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore persisted theme once on mount (read after hydration to avoid a
  // server/client mismatch on the theme classes).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(localStorage.getItem(THEME_KEY) === "dark");
  }, []);

  function toggleTheme() {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  }

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  }, [router]);

  // 15-minute inactivity auto-logout.
  useEffect(() => {
    function reset() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(logout, INACTIVITY_MS);
    }
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [logout]);

  const sidebarWidth = collapsed ? "lg:w-16" : "lg:w-60";

  return (
    <div className="flex min-h-screen bg-navy">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-navy text-paper transition-transform lg:static lg:translate-x-0 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <Link href="/admin" className="font-display text-lg font-bold">
              khaliplot<span className="text-amber">.admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden text-paper/60 hover:text-paper lg:block"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={18} className={collapsed ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-paper/60 hover:text-paper lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={item.label}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-amber font-semibold text-navy"
                    : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && !item.live && (
                  <span className="rounded-full bg-paper/15 px-1.5 py-0.5 text-[10px] font-semibold text-paper/70">
                    soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-paper/10 p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-paper/75 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex min-w-0 flex-1 flex-col ${dark ? "bg-[#0a1626] text-paper" : "bg-paper text-ink"}`}>
        <header
          className={`sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 sm:px-6 ${
            dark ? "border-paper/10 bg-[#0a1626]" : "border-line bg-paper"
          }`}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">Signed in as admin</span>
            <button
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                dark
                  ? "border-paper/20 text-paper hover:bg-paper/10"
                  : "border-line text-navy hover:bg-paper-dim"
              }`}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
