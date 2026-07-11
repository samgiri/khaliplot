export const metadata = {
  title: "Privacy Policy | KhaliPlot.in",
  description: "How KhaliPlot.in collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

      <div className="mt-6 rounded-lg border border-line bg-green-pale p-5 text-sm text-green">
        Your contact details are never shown publicly. We never sell your data to third
        parties. Data is used only to improve KhaliPlot services.
      </div>

      <div className="mt-8 space-y-6 text-ink/80">
        <section>
          <h2 className="font-display font-semibold text-navy">1. What we collect</h2>
          <p className="mt-2 text-sm">
            When you create an account, list a plot, save a listing, or send us a message, we
            collect the information you provide — such as your name, email, phone number, and
            details about the plot you&apos;re listing or asking about.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">2. How we use it</h2>
          <p className="mt-2 text-sm">
            We use your information to run the marketplace: showing your listings to buyers,
            connecting buyers with sellers through contact reveals, responding to inquiries, and
            improving KhaliPlot&apos;s features. We do not use your data for anything beyond
            operating and improving the service.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">3. What stays private</h2>
          <p className="mt-2 text-sm">
            Seller phone numbers are never displayed publicly on a listing. A buyer must use a
            contact reveal to view a seller&apos;s number, and that action is logged so sellers
            can see who has reached out. Contact form messages go directly to our team, not to
            other users.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">4. Sharing</h2>
          <p className="mt-2 text-sm">
            We never sell your data to third parties. We may share limited information with
            service providers who help us run KhaliPlot (such as hosting and database
            infrastructure), solely to operate the platform.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">5. Your choices</h2>
          <p className="mt-2 text-sm">
            You can update or delete your account information at any time from your dashboard, or
            by contacting us directly.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-navy">6. Contact</h2>
          <p className="mt-2 text-sm">
            Questions about your data? Email us at{" "}
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
