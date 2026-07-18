import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import TransactionsClient from "./TransactionsClient";

export const metadata = {
  title: "Transactions · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function AdminTransactionsPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <AdminShell active="transactions">
      <TransactionsClient />
    </AdminShell>
  );
}
