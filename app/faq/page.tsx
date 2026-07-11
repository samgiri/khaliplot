import Link from "next/link";

export const metadata = {
  title: "FAQ | KhaliPlot.in",
  description: "Frequently asked questions about buying, selling and listing plots on KhaliPlot.",
};

const faqs = [
  {
    q: "Is listing my plot free?",
    a: "Yes. Every seller can post up to 2 listings for free on the FREE plan — no listing fees, no commission on your first plots.",
  },
  {
    q: "How do contact reveals work?",
    a: "A seller's phone number stays hidden until a buyer 'reveals' it. The FREE plan includes 1 reveal per month; Reveal Packs and Plus plans give you more, so you only pay when you're genuinely interested in a plot.",
  },
  {
    q: "Is my phone number private?",
    a: "Yes. Your number is never shown publicly on any listing. It's only shared with a buyer after they use a contact reveal — and we never sell your details to third parties.",
  },
  {
    q: "What is an NA plot?",
    a: "NA stands for 'Non-Agricultural'. It means the land has official government approval to be used for residential, commercial or industrial construction, instead of only farming.",
  },
  {
    q: "What is a guntha?",
    a: "A guntha is a traditional land measurement unit used in Maharashtra and parts of India — 1 guntha equals about 1,089 square feet, and 40 gunthas make up 1 acre.",
  },
  {
    q: "How do I pay for a plan?",
    a: "Online payments are launching soon. For now, you can browse packages on the Pricing page and reach out to our team via the Contact page or WhatsApp to get started.",
  },
  {
    q: "Can I trust the listings on KhaliPlot?",
    a: "Plots marked 'Verified' have been checked for clear title, NA conversion status and accurate dimensions before going live. Always do your own due diligence before making a purchase.",
  },
  {
    q: "Which cities does KhaliPlot cover?",
    a: "We're live in Lonavla, Maharashtra today, and expanding city by city — Pune and Nashik are next on our roadmap.",
  },
  {
    q: "How do I contact a seller?",
    a: "Open any listing and use a contact reveal to unlock the seller's phone number, then talk to them directly — no broker in between.",
  },
  {
    q: "What if I have another question?",
    a: "Reach us any time via the Contact page, WhatsApp, or email at hello@khaliplot.in.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">FAQ</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-ink/80">
        Can&apos;t find what you&apos;re looking for?{" "}
        <Link href="/contact" className="font-semibold text-green hover:text-navy">
          Contact us
        </Link>
        .
      </p>

      <div className="mt-8 divide-y divide-line rounded-lg border border-line bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display font-semibold text-navy">
              {faq.q}
              <span className="shrink-0 text-green transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-ink/70">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
