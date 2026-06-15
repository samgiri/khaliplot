import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
