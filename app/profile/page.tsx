import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile-service";
import ProfileForm from "@/components/ProfileForm";

export const metadata = {
  title: "My profile | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }

  const profile = session.profile;

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:px-8">
      <p className="coord-label text-green">Account</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">My profile</h1>
      <p className="mt-1 text-sm text-muted">Keep your details up to date.</p>

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
          showEmail
          showContactMethod
          submitLabel="Save changes"
          redirectTo="/profile"
        />
      </div>
    </div>
  );
}
