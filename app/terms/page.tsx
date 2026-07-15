export const metadata = {
  title: "Terms & Conditions | KhaliPlot.in",
  description: "Terms and conditions for using KhaliPlot.in, India's plot marketplace.",
};

const sections = [
  {
    h: "1. About KhaliPlot & platform liability",
    p: `KhaliPlot.in is a marketplace that connects buyers with owners of vacant land ("plots") across India. We are a listing and discovery platform only — we are not a party to any sale, we do not own the plots listed, and we do not hold, transfer, or guarantee any money between buyers and sellers. Any transaction is solely between the buyer and the seller. KhaliPlot is not liable for the conduct of any user, the accuracy of any listing, or the outcome of any deal.`,
  },
  {
    h: "2. Buyer responsibility",
    p: `Buyers must independently verify every material fact before paying any money or committing to a purchase — including legal title, survey number, land records (7/12, Jamabandi, etc.), NA/zoning status, encumbrances, dimensions and boundaries. Visit the plot in person and consult a lawyer where appropriate. Reveal fees only unlock a seller's contact; they are not an endorsement or guarantee of the plot.`,
  },
  {
    h: "3. Seller responsibility",
    p: `Sellers are responsible for the accuracy and legality of everything they post, including ownership, title, dimensions, pricing and declared documents. Sellers must have the legal right to sell the plot listed. Posting false, misleading or fraudulent information is prohibited and may result in listing removal and account suspension.`,
  },
  {
    h: "4. Pricing model — ₹499 info fee, ₹0 commission",
    p: `KhaliPlot charges a small fee to reveal a seller's contact details (a Reveal Pack is ₹499 for 10 reveals in 90 days), plus optional Plus subscriptions and listing Boosts as described on our Pricing page. KhaliPlot charges ₹0 commission on any sale — the full sale value stays between buyer and seller. Prices and features may change; the terms in effect at the time of purchase apply to that purchase.`,
  },
  {
    h: "5. Payment & fraud protection",
    p: `Payments for KhaliPlot plans are made only through our official payment options. KhaliPlot will never ask you to transfer plot payments, tokens, or advances to us or to any KhaliPlot representative. All plot payments happen directly between buyer and seller. Never send money to "hold" a plot you have not verified. Report suspected fraud to fraud@khaliplot.in.`,
  },
  {
    h: "6. Contact reveal policy",
    p: `Revealing a seller's contact unlocks their WhatsApp/phone for direct communication. Reveals are for genuine buying interest only. Using revealed contacts for spam, bulk solicitation, or any purpose other than enquiring about the specific plot is prohibited.`,
  },
  {
    h: "7. Data & privacy",
    p: `We handle your data as described in our Privacy Policy. Seller phone numbers stay private until revealed; contact-form messages go to our team, not to other users.`,
  },
  {
    h: "8. Dispute resolution",
    p: `Disputes between buyers and sellers must be resolved between those parties. KhaliPlot is not an arbiter of, and accepts no liability for, such disputes. These terms are governed by the laws of India, and any dispute with KhaliPlot is subject to the jurisdiction of the courts where KhaliPlot is registered.`,
  },
  {
    h: "9. Prohibited activities",
    p: `Do not post false or fraudulent listings, impersonate others, scrape the platform, misuse contact details, attempt to bypass fees, or use KhaliPlot for any unlawful purpose. We may remove content or suspend accounts that violate these terms.`,
  },
  {
    h: "10. Refund policy",
    p: `Contact reveals are consumed on use and are non-refundable. Subscription plans (Plus) can be cancelled to stop future renewals; fees already paid for the current period are non-refundable except where required by law.`,
  },
  {
    h: "11. Consent to terms",
    p: `By creating an account, listing a plot, or using KhaliPlot, you confirm that you have read, understood and agreed to these Terms & Conditions.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

      <div className="mt-8 space-y-6 text-ink/80">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display font-semibold text-navy">{s.h}</h2>
            <p className="mt-2 text-sm">{s.p}</p>
          </section>
        ))}

        <section>
          <h2 className="font-display font-semibold text-navy">12. Contact</h2>
          <p className="mt-2 text-sm">
            Questions about these terms? Reach us at{" "}
            <a href="mailto:hello@khaliplot.in" className="font-semibold text-green hover:text-navy">
              hello@khaliplot.in
            </a>
            . Report fraud at{" "}
            <a href="mailto:fraud@khaliplot.in" className="font-semibold text-green hover:text-navy">
              fraud@khaliplot.in
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
