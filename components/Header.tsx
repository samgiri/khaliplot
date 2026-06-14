"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";

const navLinks = [
  { href: "/search", label: "Browse plots" },
  { href: "/seller", label: "Sell your plot" },
  { href: "/#about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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
              className="font-medium text-navy/80 transition-colors hover:text-green"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/seller"
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
                className="font-medium text-navy/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/seller"
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
