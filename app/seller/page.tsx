import { redirect } from "next/navigation";

// /seller was the pre-Part-3 mock seller dashboard stub. It's superseded by
// the real /post-plot + /my-listings flow, so this route just redirects —
// keeping the URL alive for anyone with it bookmarked or linked externally.
export default function SellerPage() {
  redirect("/post-plot");
}
