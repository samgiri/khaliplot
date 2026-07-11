import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact us | KhaliPlot.in",
  description:
    "Get in touch with the KhaliPlot team — questions about buying, selling, listing or pricing on India's plot marketplace.",
};

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

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="font-display font-semibold text-navy">Reach us directly</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-green" />
                <span className="text-ink/80">Lonavla, Maharashtra, India</span>
              </li>
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
