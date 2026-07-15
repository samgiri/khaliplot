export const metadata = {
  title: "Privacy Policy | KhaliPlot.in",
  description: "How KhaliPlot.in collects, uses and protects your data.",
};

const sections = [
  {
    h: "1. Data we collect",
    p: `When you create an account, list a plot, save a listing, search, or message us, we collect the information you provide and generate — such as your name, email, phone number, your search history, saved plots, and the details of any plot you list or ask about.`,
  },
  {
    h: "2. How we protect your data",
    p: `Data is transmitted over encrypted SSL connections and stored with our hosting and database providers under access controls. We never sell your data to third parties. We aim to align our practices with data-protection standards such as the GDPR, including data minimisation and purpose limitation.`,
  },
  {
    h: "3. Contact reveal",
    p: `Seller phone numbers are never shown publicly on a listing. A buyer must use a paid contact reveal to view a seller's number, and that action is logged so sellers can see who reached out. Email addresses are kept private, and your data is not shared with another user without your action (such as revealing a contact).`,
  },
  {
    h: "4. Cookies & analytics",
    p: `We use cookies for session tracking (to keep you signed in) and analytics (such as Google Analytics) to understand how the site is used and improve it. You can opt out of analytics cookies through your browser settings or our cookie controls where available.`,
  },
  {
    h: "5. Sharing",
    p: `We never sell your data. We may share limited information with service providers who help us operate KhaliPlot (hosting, database, payments, analytics), solely to run the platform, under appropriate safeguards.`,
  },
  {
    h: "6. Your choices",
    p: `You can update or delete your account information at any time from your dashboard, or by contacting us. You may request a copy of your data or its deletion, subject to legal retention requirements.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="coord-label text-green">Legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

      <div className="mt-6 rounded-lg border border-line bg-green-pale p-5 text-sm text-green">
        Your contact details are never shown publicly. We never sell your data to third parties.
        Data is used only to operate and improve KhaliPlot.
      </div>

      <div className="mt-8 space-y-6 text-ink/80">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display font-semibold text-navy">{s.h}</h2>
            <p className="mt-2 text-sm">{s.p}</p>
          </section>
        ))}

        <section>
          <h2 className="font-display font-semibold text-navy">7. Contact for privacy concerns</h2>
          <p className="mt-2 text-sm">
            Questions about your data or a privacy request? Email{" "}
            <a href="mailto:privacy@khaliplot.in" className="font-semibold text-green hover:text-navy">
              privacy@khaliplot.in
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
