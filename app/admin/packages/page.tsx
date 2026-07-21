import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import PackagesClient from "./PackagesClient";

export const metadata = {
  title: "Packages · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminPackagesPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <AdminShell active="packages">
      <PackagesClient />
    </AdminShell>
  );
}
