"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Plus, ChevronDown, LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { firstName } from "@/lib/profile-data";

const navLinks = [
  { href: "/browse", label: "Buy Plot" },
  { href: "/post-plot", label: "Sell Plot" },
  { href: "/pricing", label: "Package" },
  { href: "/contact", label: "Connect Us" },
];

interface HeaderUser {
  email: string;
  name: string | null;
}

export default function Header({ user }: { user: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = user ? firstName(user.name) || user.email.split("@")[0] : "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/khaliplot-logo.png"
            alt="KhaliPlot.in"
            width={44}
            height={44}
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            priority
          />
          <span className="font-display text-xl font-bold leading-none text-navy sm:text-2xl">
            khaliplot<span className="text-amber">.in</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-lg font-bold text-navy transition-colors hover:text-green"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 font-medium text-navy/80 transition-colors hover:text-green"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-pale text-sm font-semibold text-green">
                  {initial}
                </span>
                {displayName}
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-line bg-white py-2 shadow-md">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-navy hover:bg-paper-dim"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-navy hover:bg-paper-dim"
                  >
                    <UserCircle size={16} /> My profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-navy hover:bg-paper-dim"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="font-medium text-navy/80 transition-colors hover:text-green"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/post-plot"
            className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            <Plus size={18} strokeWidth={2.5} />
            Post a plot
          </Link>
        </div>

        <button
          className="text-navy md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-lg font-bold text-navy"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="plot-divider my-1" />
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-medium text-navy/80"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 font-medium text-navy/80"
                  onClick={() => setOpen(false)}
                >
                  <UserCircle size={18} /> My profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-left font-medium text-navy/80"
                >
                  <LogOut size={18} /> Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="font-medium text-navy/80"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}
            <Link
              href="/post-plot"
              className="flex w-fit items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy"
              onClick={() => setOpen(false)}
            >
              <Plus size={18} strokeWidth={2.5} />
              Post a plot
            </Link>
          </nav>
        </div>
      )}

      <div className="plot-divider" />
    </header>
  );
}
