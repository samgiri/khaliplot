import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ContentClient from "./ContentClient";

export const metadata = {
  title: "Content · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <AdminShell active="content">
      <ContentClient />
    </AdminShell>
  );
}
