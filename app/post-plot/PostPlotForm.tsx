"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  MapPin,
  Home as HomeIcon,
  Tractor,
  Building2,
  TreePine,
  Factory,
  Sparkles,
  ImagePlus,
  X,
  Loader2,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { cities as ALL_CITIES, plotTypes, formatPrice, type Listing } from "@/lib/data";
import { INDIAN_STATES, PRIME_CITIES, OTHER_CITY } from "@/lib/profile-data";
import { AREA_UNITS, toSqft, unitLabel, formatIndianRupees, type AreaUnit } from "@/lib/listing-units";
import { getLandRecordLabel } from "@/lib/land-records";
import {
  OWNERSHIP_TYPES,
  TRANSACTION_TYPES,
  NA_STATUS_OPTIONS,
  FACING_OPTIONS,
  type ListingDocuments,
} from "@/lib/listing-form-data";
import { compressImage } from "@/lib/image-compress";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const plotTypeIcons: Record<string, typeof HomeIcon> = {
  Residential: HomeIcon,
  Agricultural: Tractor,
  Commercial: Building2,
  Farmhouse: TreePine,
  Industrial: Factory,
};

const MAX_PHOTOS = 8;

interface PhotoSlot {
  key: string;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  url?: string;
}

function citySelectValue(city: string): string {
  return (PRIME_CITIES as readonly string[]).includes(city) ? city : city ? OTHER_CITY : "";
}

export default function PostPlotForm({
  editingId,
  initial,
}: {
  editingId?: string;
  initial?: Listing | null;
}) {
  const router = useRouter();

  // Location
  const [state, setState] = useState(initial?.state ?? "");
  const [citySelect, setCitySelect] = useState(initial ? citySelectValue(initial.city) : "");
  const [cityOther, setCityOther] = useState(
    initial && citySelectValue(initial.city) === OTHER_CITY ? initial.city : ""
  );
  const [locality, setLocality] = useState(initial?.locality ?? "");
  const [mapsLink, setMapsLink] = useState(initial?.mapsLink ?? "");
  const city = citySelect === OTHER_CITY ? cityOther.trim() : citySelect;

  // Plot type
  const [plotType, setPlotType] = useState(initial?.plotType ?? "");

  // Size & price
  const [areaUnit, setAreaUnit] = useState<AreaUnit>((initial?.areaUnit as AreaUnit) ?? "sqft");
  const [areaValue, setAreaValue] = useState(initial?.areaValue ? String(initial.areaValue) : "");
  const [price, setPrice] = useState(initial ? String(Math.round(initial.priceLakh * 100000)) : "");
  const [perUnitTouched, setPerUnitTouched] = useState(false);
  const [pricePerUnitInput, setPricePerUnitInput] = useState(
    initial?.pricePerUnit ? String(Math.round(initial.pricePerUnit)) : ""
  );

  const areaValueNum = Number(areaValue) || 0;
  const priceNum = Number(price) || 0;
  const areaSqft = areaValueNum > 0 ? toSqft(areaValueNum, areaUnit) : 0;
  const pricePerSqft = areaSqft > 0 && priceNum > 0 ? priceNum / areaSqft : 0;
  const computedPricePerUnit = areaValueNum > 0 && priceNum > 0 ? priceNum / areaValueNum : 0;
  const displayedPricePerUnit = perUnitTouched && pricePerUnitInput ? Number(pricePerUnitInput) : computedPricePerUnit;

  // Title
  const [title, setTitle] = useState(initial?.title ?? "");

  // Ownership & documents
  const [ownershipType, setOwnershipType] = useState(initial?.ownershipType ?? "");
  const [transactionType, setTransactionType] = useState(initial?.transactionType ?? "");
  const [naStatus, setNaStatus] = useState(initial?.naStatus ?? "");
  const [documents, setDocuments] = useState<ListingDocuments>(initial?.documents ?? {});
  const landRecordLabel = getLandRecordLabel(state);

  function toggleDocument(key: keyof ListingDocuments) {
    setDocuments((d) => ({ ...d, [key]: !d[key] }));
  }

  // More details
  const [showMore, setShowMore] = useState(false);
  const [facing, setFacing] = useState(initial?.facing ?? "East");
  const [roadWidthFt, setRoadWidthFt] = useState(
    initial?.roadWidthFt ? String(initial.roadWidthFt) : ""
  );
  const [cornerPlot, setCornerPlot] = useState(initial?.cornerPlot ?? false);
  const [boundaryWall, setBoundaryWall] = useState(initial?.boundaryWall ?? false);
  const [gatedLayout, setGatedLayout] = useState(initial?.gatedLayout ?? false);
  const [possession, setPossession] = useState(initial?.possession ?? "Immediate");

  // Description + AI writer
  const [description, setDescription] = useState(initial?.description ?? "");
  const [hint, setHint] = useState("");
  const [generating, setGenerating] = useState(false);

  // Photos
  const [photos, setPhotos] = useState<PhotoSlot[]>(
    (initial?.photoUrls ?? []).map((url, i) => ({
      key: `existing-${i}`,
      previewUrl: url,
      status: "done" as const,
      url,
    }))
  );
  const uploadedUrls = photos.filter((p) => p.status === "done" && p.url).map((p) => p.url!) as string[];

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const citiesForDropdown = useMemo(() => Array.from(new Set([...PRIME_CITIES, ...ALL_CITIES])), []);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    e.target.value = "";
    if (files.length === 0) return;

    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    for (const file of files) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const previewUrl = URL.createObjectURL(file);
      setPhotos((prev) => [...prev, { key, previewUrl, status: "uploading" }]);

      try {
        const compressed = await compressImage(file);
        const path = `${user.id}/${key}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(path, compressed, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from("listing-photos").getPublicUrl(path);
        setPhotos((prev) =>
          prev.map((p) => (p.key === key ? { ...p, status: "done", url: publicUrl.publicUrl } : p))
        );
      } catch {
        setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, status: "error" } : p)));
      }
    }
  }

  function removePhoto(key: string) {
    setPhotos((prev) => prev.filter((p) => p.key !== key));
  }

  async function handleGenerateDescription() {
    if (!city || !state || !areaValueNum || !priceNum) {
      setErrorMessage("Fill in location, size and price first, then generate a description.");
      setStatus("error");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/listings/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plotType,
          city,
          state,
          locality,
          areaUnit,
          areaValue: areaValueNum,
          priceLakh: priceNum / 100000,
          naStatus,
          hint,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDescription(data.description);
      }
    } catch {
      // silently ignore — user can still write their own description
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const payload = {
      title,
      plotType,
      state,
      city,
      locality,
      mapsLink,
      areaUnit,
      areaValue: areaValueNum,
      price: priceNum,
      pricePerUnitOverride: perUnitTouched ? Number(pricePerUnitInput) : undefined,
      ownershipType,
      transactionType,
      naStatus,
      documents,
      facing,
      roadWidthFt: Number(roadWidthFt) || 0,
      cornerPlot,
      boundaryWall,
      gatedLayout,
      possession,
      description,
      photoUrls: uploadedUrls,
    };

    try {
      const res = await fetch(editingId ? `/api/listings/${editingId}` : "/api/listings", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      router.push("/my-listings?posted=1");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const anyUploading = photos.some((p) => p.status === "uploading");

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Location */}
      <section className="space-y-4">
        <p className="coord-label text-green">Location</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">State</label>
            <select
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">City / Area</label>
            <select
              required
              value={citySelect}
              onChange={(e) => setCitySelect(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
            >
              <option value="">Select city</option>
              {citiesForDropdown.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value={OTHER_CITY}>Other</option>
            </select>
            {citySelect === OTHER_CITY && (
              <input
                required
                value={cityOther}
                onChange={(e) => setCityOther(e.target.value)}
                placeholder="Enter your city / area"
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">Locality / Village</label>
            <input
              required
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Tungarli"
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">
              Google Maps link <span className="font-normal text-muted">(optional)</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full rounded-md border border-line bg-white py-2.5 pl-9 pr-3 text-sm focus:border-green-bright"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plot type */}
      <section className="space-y-3">
        <p className="coord-label text-green">Plot type</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {plotTypes.map((t) => {
            const Icon = plotTypeIcons[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setPlotType(t)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors ${
                  plotType === t ? "border-green bg-green-pale" : "border-line bg-white hover:border-green-bright"
                }`}
              >
                <Icon size={22} className="text-green" />
                <span className="text-sm font-semibold text-navy">{t}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Size & price */}
      <section className="space-y-4">
        <p className="coord-label text-green">Size &amp; price</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">Plot size</label>
            <div className="flex gap-2">
              <input
                required
                type="number"
                min="0"
                step="any"
                value={areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                placeholder="e.g. 2400"
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                className="w-40 shrink-0 rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
              >
                {AREA_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            {areaSqft > 0 && areaUnit !== "sqft" && (
              <p className="text-xs text-muted">= {Math.round(areaSqft).toLocaleString("en-IN")} sq ft</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-navy">Total price (₹)</label>
            <input
              required
              type="number"
              min="0"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 4200000"
              className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
            />
            {priceNum > 0 && (
              <p className="text-xs text-muted">{formatIndianRupees(priceNum)} · {formatPrice(priceNum / 100000)}</p>
            )}
          </div>
        </div>

        {areaValueNum > 0 && priceNum > 0 && (
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-line bg-paper-dim p-4 sm:grid-cols-2">
            <div>
              <p className="coord-label">₹ per sq ft</p>
              <p className="font-display font-semibold text-navy">{formatIndianRupees(pricePerSqft)}</p>
            </div>
            <div>
              <p className="coord-label">₹ per {unitLabel(areaUnit)} (editable)</p>
              <input
                type="number"
                min="0"
                step="any"
                value={perUnitTouched ? pricePerUnitInput : String(Math.round(computedPricePerUnit))}
                onChange={(e) => {
                  setPerUnitTouched(true);
                  setPricePerUnitInput(e.target.value);
                }}
                className="mt-1 w-full rounded-md border border-line bg-white px-3 py-1.5 text-sm focus:border-green-bright"
              />
              {perUnitTouched && (
                <button
                  type="button"
                  onClick={() => setPerUnitTouched(false)}
                  className="mt-1 text-xs font-semibold text-green hover:text-navy"
                >
                  Reset to auto-calculated
                </button>
              )}
            </div>
            {displayedPricePerUnit > 0 && (
              <p className="text-xs text-muted sm:col-span-2">
                {formatIndianRupees(displayedPricePerUnit)} per {unitLabel(areaUnit)}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Title */}
      <section className="space-y-1.5">
        <label className="text-sm font-semibold text-navy">Title</label>
        <input
          required
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. NA Plot near Lonavla Lake, Tungarli"
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
        />
        <p className="text-right text-xs text-muted">{title.length}/80</p>
      </section>

      {/* Ownership & documents */}
      <section className="space-y-4 rounded-xl border-2 border-navy bg-white p-5 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-6">
        <div>
          <p className="coord-label text-green">Ownership &amp; documents</p>
          <p className="mt-1 text-sm text-muted">
            Buyers trust listings with clear documentation — fill in what you have.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-navy">Ownership type</p>
          <div className="flex flex-wrap gap-2">
            {OWNERSHIP_TYPES.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOwnershipType(o)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  ownershipType === o ? "border-green bg-green text-paper" : "border-line bg-white text-ink hover:border-green-bright"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-navy">Transaction</p>
          <div className="flex flex-wrap gap-2">
            {TRANSACTION_TYPES.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setTransactionType(o)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  transactionType === o ? "border-green bg-green text-paper" : "border-line bg-white text-ink hover:border-green-bright"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-navy">NA / land-use converted?</p>
          <div className="flex flex-wrap gap-2">
            {NA_STATUS_OPTIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setNaStatus(o)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  naStatus === o ? "border-green bg-green text-paper" : "border-line bg-white text-ink hover:border-green-bright"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-navy">Documents available</p>
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!documents.sale_deed} onChange={() => toggleDocument("sale_deed")} className="h-4 w-4 accent-green" />
              Sale Deed
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!documents.title_clear} onChange={() => toggleDocument("title_clear")} className="h-4 w-4 accent-green" />
              Title clear
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!documents.ec} onChange={() => toggleDocument("ec")} className="h-4 w-4 accent-green" />
              Encumbrance Certificate (EC)
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!documents.mutation_done} onChange={() => toggleDocument("mutation_done")} className="h-4 w-4 accent-green" />
              Mutation done
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!documents.land_record} onChange={() => toggleDocument("land_record")} className="h-4 w-4 accent-green" />
              {landRecordLabel} extract
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={!!documents.rera_registered}
                onChange={() => toggleDocument("rera_registered")}
                className="h-4 w-4 accent-green"
              />
              RERA registered
            </label>
            {documents.rera_registered && (
              <input
                value={documents.rera_number ?? ""}
                onChange={(e) => setDocuments((d) => ({ ...d, rera_number: e.target.value }))}
                placeholder="RERA registration number"
                className="ml-6 w-[calc(100%-1.5rem)] rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-green-bright"
              />
            )}
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={!!documents.layout_approved}
                onChange={() => toggleDocument("layout_approved")}
                className="h-4 w-4 accent-green"
              />
              Layout approved
            </label>
            {documents.layout_approved && (
              <input
                value={documents.layout_authority ?? ""}
                onChange={(e) => setDocuments((d) => ({ ...d, layout_authority: e.target.value }))}
                placeholder="Approving authority (CIDCO, PMRDA, JDA, DTCP, HMDA...)"
                className="ml-6 w-[calc(100%-1.5rem)] rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-green-bright"
              />
            )}
          </div>
        </div>
      </section>

      {/* More details (accordion) */}
      <section>
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-line bg-white px-4 py-3 text-left"
        >
          <span className="font-semibold text-navy">More details (optional)</span>
          <ChevronDown size={18} className={`text-navy transition-transform ${showMore ? "rotate-180" : ""}`} />
        </button>
        {showMore && (
          <div className="mt-4 space-y-4 rounded-lg border border-line bg-white p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-navy">Facing</label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
                >
                  {FACING_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-navy">Road width (ft)</label>
                <input
                  type="number"
                  min="0"
                  value={roadWidthFt}
                  onChange={(e) => setRoadWidthFt(e.target.value)}
                  className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={cornerPlot} onChange={(e) => setCornerPlot(e.target.checked)} className="h-4 w-4 accent-green" />
                Corner plot
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={boundaryWall} onChange={(e) => setBoundaryWall(e.target.checked)} className="h-4 w-4 accent-green" />
                Boundary wall
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={gatedLayout} onChange={(e) => setGatedLayout(e.target.checked)} className="h-4 w-4 accent-green" />
                Gated layout
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-navy">Possession</label>
              <input
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                placeholder="Immediate, or e.g. Dec 2026"
                className="w-full max-w-xs rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
          </div>
        )}
      </section>

      {/* Description + AI writer */}
      <section className="space-y-2">
        <label className="text-sm font-semibold text-navy">Description</label>
        <textarea
          rows={5}
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the plot — access roads, nearby landmarks, water/electricity, title status..."
          className="w-full resize-none rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Optional hints, e.g. corner plot, near highway, mango trees"
            className="flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-green-bright"
          />
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={generating}
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border-2 border-green bg-green-pale px-4 py-2 text-sm font-semibold text-green transition-colors hover:bg-green hover:text-paper disabled:opacity-60"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating ? "Writing…" : "Write it for me"}
          </button>
        </div>
      </section>

      {/* Photos */}
      <section className="space-y-3">
        <p className="text-sm font-semibold text-navy">
          Photos <span className="font-normal text-muted">(up to {MAX_PHOTOS}, first photo is the cover)</span>
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.key} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-green-pale">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
              {p.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-navy/40">
                  <Loader2 size={18} className="animate-spin text-paper" />
                </div>
              )}
              {p.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-amber/80 text-xs font-semibold text-navy">
                  Failed
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(p.key)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-paper"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-line text-muted hover:border-green-bright">
              <ImagePlus size={22} />
              <span className="text-xs">Add photo</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
            </label>
          )}
        </div>
      </section>

      <p className="rounded-lg border border-line bg-paper-dim p-4 text-sm text-ink/70">
        🔒 Your phone number will stay private — buyers contact you through KhaliPlot.
      </p>

      {status === "error" && (
        <div className="rounded-lg border border-line bg-paper-dim p-4 text-sm text-amber-dark">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || anyUploading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-amber px-6 py-3.5 font-semibold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? (
          "Publishing…"
        ) : (
          <>
            {editingId ? "Save changes" : "Publish plot"} <CheckCircle2 size={18} />
          </>
        )}
      </button>
    </form>
  );
}
