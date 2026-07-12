import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile-service";
import { isProfileComplete } from "@/lib/profile-data";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSellerListingById } from "@/lib/listings-service";
import PostPlotForm from "./PostPlotForm";

export const metadata = {
  title: "Post a plot | KhaliPlot.in",
  robots: { index: false, follow: false },
};

export default async function PostPlotPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/login");
  }
  if (!isProfileComplete(session.profile)) {
    redirect("/welcome");
  }

  const { edit } = await searchParams;
  let initial = null;
  if (edit) {
    const supabase = await createSupabaseServerClient();
    initial = (await getSellerListingById(supabase, edit, session.userId)) ?? null;
    if (!initial) {
      redirect("/my-listings");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="coord-label text-green">{edit ? "Edit plot" : "Post a plot"}</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
        {edit ? "Edit your listing" : "List your plot — free"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Takes about 5 minutes. Fields marked required must be filled in.
      </p>

      <div className="mt-6">
        <PostPlotForm editingId={edit} initial={initial} />
      </div>
    </div>
  );
}
