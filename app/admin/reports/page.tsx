import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ReportsClient from "./ReportsClient";

export const metadata = {
  title: "Reports · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminReportsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <AdminShell active="reports">
      <ReportsClient />
    </AdminShell>
  );
}
