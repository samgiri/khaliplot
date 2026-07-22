import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in | KhaliPlot.in",
};

export default async function LoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (configured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-14">
      <div className="w-full rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
        <p className="coord-label text-green">Sign in</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy">Welcome to KhaliPlot</h1>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll email you a link — no password needed.
        </p>
        {configured ? (
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        ) : (
          <p className="mt-6 rounded-lg border border-line bg-paper-dim p-4 text-sm text-muted">
            Sign-in isn&apos;t configured on this environment yet.
          </p>
        )}
      </div>
    </div>
  );
}
