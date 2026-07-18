"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus, Pencil, Trash2, X, Loader2, LayoutDashboard } from "lucide-react";
import { plotTypes, cities, formatPrice, formatArea } from "@/lib/data";

interface AdminListing {
  id: string;
  title: string;
  plot_type: string;
  city: string;
  locality: string;
  state: string;
  area_sqft: number;
  price_lakh: number;
  price_per_sqft: number;
  facing: string;
  road_width_ft: number;
  dimensions: string;
  zone: string;
  features: string[];
  description: string;
  verified: boolean;
  status: string;
  seller_name: string;
  seller_type: string;
  seller_phone: string;
  lat: number | null;
  lng: number | null;
  images: number;
  created_at: string;
}

const emptyForm = {
  title: "",
  plot_type: "Residential",
  city: cities[0] as string,
  locality: "",
  state: "Maharashtra",
  area_sqft: "",
  price_lakh: "",
  price_per_sqft: "",
  facing: "East",
  road_width_ft: "",
  dimensions: "",
  zone: "",
  features: "",
  description: "",
  verified: false,
  status: "pending",
  seller_name: "",
  seller_type: "Owner",
  seller_phone: "",
  lat: "",
  lng: "",
  images: "0",
};

type FormState = typeof emptyForm;

const statusStyles: Record<string, string> = {
  live: "bg-green-pale text-green",
  pending: "bg-amber/20 text-amber-dark",
  sold: "bg-line text-muted",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminDashboardClient() {
  const router = useRouter();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Promise-chain style (not async/await) so every setState sits inside a
  // callback rather than the function body — this keeps the mount effect clean
  // under react-hooks/set-state-in-effect. Returns the promise so handlers can
  // still `await loadListings()`. `loading` starts true for the initial load.
  function loadListings() {
    return fetch("/api/admin/listings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load listings");
        return res.json();
      })
      .then((data) => {
        setListings(data.listings ?? []);
        setError("");
      })
      .catch(() => setError("Could not load listings."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadListings();
  }, []);

  function openNewForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(listing: AdminListing) {
    setForm({
      title: listing.title,
      plot_type: listing.plot_type,
      city: listing.city,
      locality: listing.locality,
      state: listing.state,
      area_sqft: String(listing.area_sqft),
      price_lakh: String(listing.price_lakh),
      price_per_sqft: String(listing.price_per_sqft),
      facing: listing.facing,
      road_width_ft: String(listing.road_width_ft),
      dimensions: listing.dimensions,
      zone: listing.zone,
      features: (listing.features ?? []).join(", "),
      description: listing.description,
      verified: listing.verified,
      status: listing.status,
      seller_name: listing.seller_name,
      seller_type: listing.seller_type,
      seller_phone: listing.seller_phone,
      lat: listing.lat != null ? String(listing.lat) : "",
      lng: listing.lng != null ? String(listing.lng) : "",
      images: String(listing.images ?? 0),
    });
    setEditingId(listing.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      plot_type: form.plot_type,
      city: form.city,
      locality: form.locality,
      state: form.state,
      area_sqft: Number(form.area_sqft),
      price_lakh: Number(form.price_lakh),
      price_per_sqft: Number(form.price_per_sqft),
      facing: form.facing,
      road_width_ft: Number(form.road_width_ft || 0),
      dimensions: form.dimensions,
      zone: form.zone,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      description: form.description,
      verified: form.verified,
      status: form.status,
      seller_name: form.seller_name,
      seller_type: form.seller_type,
      seller_phone: form.seller_phone,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      images: Number(form.images || 0),
    };

    try {
      const res = await fetch("/api/admin/listings", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save listing");
      }

      closeForm();
      await loadListings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save listing");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing? This can't be undone.")) return;

    try {
      const res = await fetch(`/api/admin/listings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadListings();
    } catch {
      setError("Failed to delete listing.");
    }
  }

  async function handleQuickStatus(listing: AdminListing, status: string) {
    try {
      const res = await fetch("/api/admin/listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await loadListings();
    } catch {
      setError("Failed to update status.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="coord-label text-green">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
            Manage listings
          </h1>
          <p className="mt-1 text-sm text-muted">
            {listings.length} listing{listings.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-md border border-line px-4 py-2 font-semibold text-navy hover:border-green-bright"
          >
            <LayoutDashboard size={16} />
            Overview
          </Link>
          <button
            onClick={openNewForm}
            className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            <Plus size={18} />
            Add listing
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-md border border-line px-4 py-2 font-semibold text-navy hover:border-green-bright"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-amber/40 bg-amber/10 px-4 py-2.5 text-sm text-amber-dark">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted">
          <Loader2 size={18} className="animate-spin" />
          Loading listings…
        </div>
      ) : listings.length === 0 ? (
        <div className="plot-border rounded-lg bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy">No listings yet</p>
          <p className="mt-2 text-sm text-muted">
            Click &quot;Add listing&quot; to create your first one.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="p-3 font-semibold text-navy">Title</th>
                <th className="p-3 font-semibold text-navy">City</th>
                <th className="p-3 font-semibold text-navy">Type</th>
                <th className="p-3 font-semibold text-navy">Price</th>
                <th className="p-3 font-semibold text-navy">Area</th>
                <th className="p-3 font-semibold text-navy">Status</th>
                <th className="p-3 font-semibold text-navy">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-b border-line last:border-b-0">
                  <td className="max-w-[220px] truncate p-3 font-medium text-navy">{listing.title}</td>
                  <td className="p-3 text-ink/80">{listing.city}</td>
                  <td className="p-3 text-ink/80">{listing.plot_type}</td>
                  <td className="p-3 text-ink/80">{formatPrice(listing.price_lakh)}</td>
                  <td className="p-3 text-ink/80">{formatArea(listing.area_sqft)}</td>
                  <td className="p-3">
                    <select
                      value={listing.status}
                      onChange={(e) => handleQuickStatus(listing, e.target.value)}
                      className={`rounded-full border-0 px-2 py-1 text-xs font-semibold ${statusStyles[listing.status] ?? "bg-line text-muted"}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="live">Live</option>
                      <option value="sold">Sold</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(listing)}
                        aria-label="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line hover:border-green-bright"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        aria-label="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-amber-dark hover:border-amber-dark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 p-4 sm:p-8">
          <div className="w-full max-w-2xl rounded-xl border-2 border-navy bg-paper p-5 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-navy">
                {editingId ? "Edit listing" : "Add listing"}
              </h2>
              <button onClick={closeForm} aria-label="Close">
                <X size={22} className="text-navy" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-navy">Title</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Plot type</label>
                  <select
                    value={form.plot_type}
                    onChange={(e) => setForm({ ...form, plot_type: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  >
                    {plotTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">City</label>
                  <input
                    required
                    type="text"
                    list="city-options"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                  <datalist id="city-options">
                    {cities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Locality</label>
                  <input
                    required
                    type="text"
                    value={form.locality}
                    onChange={(e) => setForm({ ...form, locality: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">State</label>
                  <input
                    required
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Area (sqft)</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.area_sqft}
                    onChange={(e) => setForm({ ...form, area_sqft: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Price (₹ Lakh)</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.price_lakh}
                    onChange={(e) => setForm({ ...form, price_lakh: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Price per sqft (₹)</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={form.price_per_sqft}
                    onChange={(e) => setForm({ ...form, price_per_sqft: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Facing</label>
                  <select
                    value={form.facing}
                    onChange={(e) => setForm({ ...form, facing: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  >
                    {["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Road width (ft)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.road_width_ft}
                    onChange={(e) => setForm({ ...form, road_width_ft: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 40 x 60 ft"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Zone / NA status</label>
                  <input
                    type="text"
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-navy">
                    Features <span className="text-muted">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Gated community, Borewell, Clear title"
                    value={form.features}
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-navy">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Seller name</label>
                  <input
                    required
                    type="text"
                    value={form.seller_name}
                    onChange={(e) => setForm({ ...form, seller_name: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Seller type</label>
                  <select
                    value={form.seller_type}
                    onChange={(e) => setForm({ ...form, seller_type: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  >
                    <option>Owner</option>
                    <option>Agent</option>
                    <option>Builder</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Seller phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={form.seller_phone}
                    onChange={(e) => setForm({ ...form, seller_phone: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Photo count</label>
                  <input
                    type="number"
                    value={form.images}
                    onChange={(e) => setForm({ ...form, images: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                  >
                    <option value="pending">Pending</option>
                    <option value="live">Live</option>
                    <option value="sold">Sold</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="verified"
                    type="checkbox"
                    checked={form.verified}
                    onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                    className="h-4 w-4 accent-green"
                  />
                  <label htmlFor="verified" className="text-sm font-semibold text-navy">
                    Verified listing
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-amber-dark">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-line px-4 py-2 font-semibold text-navy hover:border-green-bright"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-green px-5 py-2 font-semibold text-paper hover:bg-navy disabled:opacity-60"
                >
                  {saving ? "Saving…" : editingId ? "Save changes" : "Create listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
