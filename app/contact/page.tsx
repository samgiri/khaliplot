import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact us | KhaliPlot.in",
  description:
    "Get in touch with the KhaliPlot team — questions about buying, selling, listing or pricing on India's plot marketplace.",
};

const directContacts = [
  {
    label: "WhatsApp",
    href: "https://wa.me/919625763256",
    icon: MessageCircle,
    className: "bg-whatsapp hover:bg-whatsapp-hover",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:hello@khaliplot.in",
    icon: Mail,
    className: "bg-email-brand hover:bg-email-brand-hover",
    external: false,
  },
  {
    label: "Phone",
    href: "tel:+919625763256",
    icon: Phone,
    className: "bg-amber hover:bg-amber-dark",
    external: false,
  },
  {
    label: "Telegram",
    href: "https://t.me/khaliplot",
    icon: Send,
    className: "bg-telegram hover:bg-telegram-hover",
    external: true,
  },
];

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.931-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.848s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0z" />
      <path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8z" />
      <circle cx="18.406" cy="5.594" r="1.44" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
      <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/khaliplot",
    icon: FacebookIcon,
    className: "bg-facebook hover:bg-facebook-hover",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/khaliplot",
    icon: InstagramIcon,
    className: "bg-instagram-gradient",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@khaliplot",
    icon: YoutubeIcon,
    className: "bg-youtube hover:bg-youtube-hover",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="max-w-2xl">
        <p className="coord-label text-green">Get in touch</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          We&apos;re here to help
        </h1>
        <p className="mt-3 text-ink/80">
          Questions about buying, selling or listing a plot? Send us a message and our team
          will get back to you soon.
        </p>
      </div>

      {/* Direct contact buttons */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          Reach us directly
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {directContacts.map(({ label, href, icon: Icon, className, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex items-center justify-center gap-3 rounded-lg px-6 py-5 font-display text-lg font-bold text-white shadow-md transition-colors ${className}`}
            >
              <Icon size={26} strokeWidth={2.25} />
              {label}
            </a>
          ))}
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
          <ContactForm />

          {/* Social media links */}
          <div className="mt-8 border-t border-line pt-6">
            <p className="text-sm font-semibold text-navy">Follow us</p>
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors ${className}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="font-display font-semibold text-navy">Contact details</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-green" />
                <a href="mailto:hello@khaliplot.in" className="text-ink/80 hover:text-green">
                  hello@khaliplot.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-green" />
                <a href="tel:+919625763256" className="text-ink/80 hover:text-green">
                  +91 96257 63256
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="shrink-0 text-green" />
                <a
                  href="https://wa.me/919625763256"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/80 hover:text-green"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Send size={18} className="shrink-0 text-green" />
                <a
                  href="https://t.me/khaliplot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/80 hover:text-green"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-paper-dim p-6">
            <p className="text-sm text-ink/70">
              🔒 Your number stays private. We never share your contact details with third
              parties — messages here go straight to our team, not other users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
