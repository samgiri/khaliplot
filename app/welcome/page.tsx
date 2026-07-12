import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete } from "@/lib/profile-data";
import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "Welcome | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function WelcomePage() {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }

  if (isProfileComplete(session.profile)) {
    redirect("/dashboard");
  }

  const profile = session.profile;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-14 sm:px-8">
      <p className="coord-label text-green">Welcome to KhaliPlot</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        Tell us a bit about you
      </h1>
      <p className="mt-1 text-sm text-muted">
        Takes less than a minute — helps us show you the right plots.
      </p>

      <div className="mt-6 rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
        <ProfileForm
          email={session.email}
          initialName={profile?.name ?? ""}
          initialPhone={profile?.phone ?? ""}
          initialRole={profile?.role ?? null}
          initialState={profile?.state ?? ""}
          initialCity={profile?.city ?? ""}
          initialPreferredLanguage={profile?.preferred_language ?? null}
          initialPreferredContactMethod={profile?.preferred_contact_method ?? null}
          submitLabel="Save & continue →"
          redirectTo="/dashboard"
        />
      </div>
    </div>
  );
}
