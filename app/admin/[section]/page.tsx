import { notFound, redirect } from "next/navigation";
import { Construction } from "lucide-react";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import { PLACEHOLDER_SECTIONS } from "@/components/admin/adminNav";

export const metadata = {
  title: "Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { section } = await params;
  const info = PLACEHOLDER_SECTIONS[section];
  if (!info) notFound();

  return (
    <AdminShell active={section}>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{info.label}</h1>
      <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-white px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-light/60 text-amber-dark">
          <Construction size={26} />
        </div>
        <p className="mt-4 font-display text-lg font-bold text-navy">Coming soon</p>
        <p className="mt-2 max-w-md text-sm text-muted">{info.description}</p>
      </div>
    </AdminShell>
  );
}
