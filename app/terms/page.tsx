export const metadata = {
  title: "Terms of Service | KhaliPlot.in",
  description: "Terms of service for using KhaliPlot.in, India's plot marketplace.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

      <div className="mt-8 space-y-6 text-ink/80">
        <section>
          <h2 className="font-display font-semibold text-navy">1. About KhaliPlot</h2>
          <p className="mt-2 text-sm">
            KhaliPlot.in is a marketplace that connects buyers with owners of vacant land
            (&quot;plots&quot;) across India. We help people discover and list plots — we are not
            a party to any sale, and we do not hold or transfer money between buyers and sellers.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">2. Listings</h2>
          <p className="mt-2 text-sm">
            Sellers are responsible for the accuracy of the information they post, including
            title, dimensions, NA status and pricing. KhaliPlot may verify listings before they
            go live, but buyers should independently confirm all details — including legal title
            — before making any payment or commitment.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">3. Contact reveals &amp; plans</h2>
          <p className="mt-2 text-sm">
            Some features, such as unlocking a seller&apos;s contact details or boosting a
            listing, require a paid plan as described on our Pricing page. Prices and features
            may change; the terms in effect at the time of purchase apply to that purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">4. User conduct</h2>
          <p className="mt-2 text-sm">
            Do not post false, misleading or fraudulent listings, and do not misuse contact
            details obtained through the platform for spam or unrelated solicitation. We may
            remove listings or suspend accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">5. No warranty</h2>
          <p className="mt-2 text-sm">
            KhaliPlot is provided &quot;as is&quot;. We do not guarantee the accuracy of any
            listing, the outcome of any transaction, or that the service will be uninterrupted or
            error-free.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">6. Contact</h2>
          <p className="mt-2 text-sm">
            Questions about these terms? Reach us at{" "}
            <a href="mailto:hello@khaliplot.in" className="font-semibold text-green hover:text-navy">
              hello@khaliplot.in
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
