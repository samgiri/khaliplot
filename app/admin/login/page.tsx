import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-14">
      <div className="w-full rounded-xl border-2 border-navy bg-white p-6 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-8">
        <p className="coord-label text-green">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy">KhaliPlot Admin</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage listings.</p>
        <LoginForm />
      </div>
    </div>
  );
}
