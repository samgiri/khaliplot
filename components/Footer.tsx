import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 8.5v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3Z" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="8" y1="11" x2="8" y2="16" />
      <line x1="8" y1="8" x2="8" y2="8.01" />
      <path d="M12 16v-3a2 2 0 0 1 4 0v3" />
      <line x1="12" y1="11" x2="12" y2="16" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy text-paper">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/khaliplot-logo.png"
                alt="KhaliPlot.in"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-xl font-bold leading-none">
                khaliplot<span className="text-green-bright">.in</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-paper/70">
              India&apos;s plot marketplace. Find, compare and buy vacant land directly from
              verified owners — no clutter, no apartments, just plots.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: YoutubeIcon, label: "YouTube" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: LinkedinIcon, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-green-bright hover:text-green-bright"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="coord-label text-paper/50">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/search?city=Lonavla" className="text-paper/80 hover:text-green-bright">
                  Plots in Lonavla
                </Link>
              </li>
              <li>
                <Link href="/search?city=Pune" className="text-paper/80 hover:text-green-bright">
                  Plots in Pune
                </Link>
              </li>
              <li>
                <Link href="/search?city=Nashik" className="text-paper/80 hover:text-green-bright">
                  Plots in Nashik
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-paper/80 hover:text-green-bright">
                  All listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="coord-label text-paper/50">For sellers</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/seller" className="text-paper/80 hover:text-green-bright">
                  Post a plot — free
                </Link>
              </li>
              <li>
                <Link href="/seller" className="text-paper/80 hover:text-green-bright">
                  Seller dashboard
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-paper/80 hover:text-green-bright">
                  Why KhaliPlot
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="coord-label text-paper/50">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-green-bright" />
                Lonavla, Maharashtra, India
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-green-bright" />
                <a href="mailto:hello@khaliplot.in" className="hover:text-green-bright">
                  hello@khaliplot.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-green-bright" />
                <a href="tel:+919625763256" className="hover:text-green-bright">
                  +91 96257 63256
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6 text-center text-xs text-paper/50 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} KhaliPlot.in — All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Property only for plots. Made in India.</p>
        </div>
      </div>
    </footer>
  );
}
