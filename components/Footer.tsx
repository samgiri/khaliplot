import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-gradient)" />
      <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="16.2" cy="7.8" r="1" fill="#fff" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
      <path d="M10 8.5v7l6-3.5z" fill="#fff" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#1877F2" />
      <path
        d="M15.5 8.5h-1.3c-.5 0-.9.3-.9 1v1.3h2.2l-.3 2.2h-1.9V18h-2.3v-5h-1.7v-2.2h1.7V9.3c0-1.8 1-2.9 2.8-2.9h1.7v2.1z"
        fill="#fff"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
      <circle cx="7.5" cy="8" r="1.4" fill="#fff" />
      <rect x="6.3" y="10.3" width="2.4" height="7" fill="#fff" />
      <path
        d="M11 10.3h2.3v1.1c.4-.7 1.2-1.3 2.4-1.3 1.9 0 3 1.2 3 3.7v3.5h-2.4v-3.1c0-1-.4-1.7-1.3-1.7-.8 0-1.3.6-1.5 1.1-.1.2-.1.5-.1.8v2.9H11v-7z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy text-paper">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
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
                khaliplot<span className="text-amber">.in</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-paper/70">
              India&apos;s plot marketplace. Find, compare and buy vacant land directly from
              verified owners — no clutter, no apartments, just plots.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/khaliplot" },
                { icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@khaliplot" },
                { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/khaliplot" },
                { icon: LinkedinIcon, label: "LinkedIn", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  {...(href !== "#" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10 transition-transform hover:-translate-y-0.5 hover:bg-paper/15"
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
                <Link href="/post-plot" className="text-paper/80 hover:text-green-bright">
                  Post a plot — free
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="text-paper/80 hover:text-green-bright">
                  My listings
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
            <h3 className="coord-label text-paper/50">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-paper/80 hover:text-green-bright">
                  About
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-paper/80 hover:text-green-bright">
                  News
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-paper/80 hover:text-green-bright">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-paper/80 hover:text-green-bright">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-paper/80 hover:text-green-bright">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-paper/80 hover:text-green-bright">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-paper/80 hover:text-green-bright">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="coord-label text-paper/50">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/80">
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
