import { redirect } from "next/navigation";

// /seller was the pre-Part-3 mock seller dashboard stub. Since Part 6 the
// real seller dashboard lives at /seller/dashboard — keep the bare URL
// alive for anyone with it bookmarked or linked externally.
export default function SellerPage() {
  redirect("/seller/dashboard");
}
