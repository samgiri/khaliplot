import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import SupportClient from "./SupportClient";

export const metadata = {
  title: "Support · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminSupportPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <AdminShell active="support">
      <SupportClient />
    </AdminShell>
  );
}
