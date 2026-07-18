import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = {
  title: "Analytics · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <AdminShell active="analytics">
      <AnalyticsClient />
    </AdminShell>
  );
}
