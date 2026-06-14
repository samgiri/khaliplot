"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Users,
  Eye,
  Phone,
  TrendingUp,
  ImageOff,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { listings, plotTypes, cities, formatPrice, formatArea } from "@/lib/data";

type Tab = "overview" | "listings" | "add" | "leads";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "My Listings", icon: List },
  { id: "add", label: "Add Listing", icon: PlusCircle },
  { id: "leads", label: "Leads", icon: Users },
];

// Mock seller's own listings — subset of the global listings
const myListings = listings.slice(0, 4).map((l, i) => ({
  ...l,
  status: i === 2 ? "Pending review" : "Live",
  views: [342, 218, 89, 156][i],
  inquiries: [12, 7, 2, 5][i],
}));

const mockLeads = [
  {
    id: "l1",
    name: "Rohan Mehta",
    phone: "+91 98XXX XX110",
    plot: "Hillside NA Plot near Lonavla Lake",
    message: "Interested in the plot. Is the price negotiable? Can I visit this weekend?",
    time: "2 hours ago",
    status: "New",
  },
  {
    id: "l2",
    name: "Priya Sawant",
    phone: "+91 97XXX XX441",
    plot: "Open Farmland with Mango Orchard",
    message: "Looking for agricultural land for organic farming. Does this have water access?",
    time: "1 day ago",
    status: "Contacted",
  },
  {
    id: "l3",
    name: "Amit Joshi",
    phone: "+91 99XXX XX887",
    plot: "Hillside NA Plot near Lonavla Lake",
    message: "What is the exact distance from Lonavla railway station?",
    time: "2 days ago",
    status: "Contacted",
  },
  {
    id: "l4",
    name: "Sneha Kulkarni",
    phone: "+91 96XXX XX223",
    plot: "Compact Residential Plot in Town",
    message: "Can you share the 7/12 document and layout map?",
    time: "4 days ago",
    status: "Closed",
  },
];

export default function SellerDashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const totalViews = myListings.reduce((sum, l) => sum + l.views, 0);
  const totalInquiries = myListings.reduce((sum, l) => sum + l.inquiries, 0);
  const liveCount = myListings.filter((l) => l.status === "Live").length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-6">
        <p className="coord-label text-green">Seller dashboard</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">
          Welcome back, Suresh
        </h1>
        <p className="mt-1 text-sm text-muted">Manage your plots and respond to buyer inquiries.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-green text-green"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <OverviewTab
          liveCount={liveCount}
          totalViews={totalViews}
          totalInquiries={totalInquiries}
          totalListings={myListings.length}
        />
      )}
      {activeTab === "listings" && <ListingsTab />}
      {activeTab === "add" && <AddListingTab />}
      {activeTab === "leads" && <LeadsTab />}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Eye;
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-pale text-green">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function OverviewTab({
  liveCount,
  totalViews,
  totalInquiries,
  totalListings,
}: {
  liveCount: number;
  totalViews: number;
  totalInquiries: number;
  totalListings: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={List} label="Total listings" value={totalListings} />
        <StatCard icon={CheckCircle2} label="Live listings" value={liveCount} />
        <StatCard icon={Eye} label="Total views" value={totalViews.toLocaleString("en-IN")} trend="+12% this week" />
        <StatCard icon={Phone} label="Total inquiries" value={totalInquiries} trend="+3 new" />
      </div>

      <div className="mt-8 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-navy">Recent activity</h2>
        <div className="mt-4 space-y-4">
          {[
            { text: "Rohan Mehta sent an inquiry on Hillside NA Plot near Lonavla Lake", time: "2 hours ago" },
            { text: "Your listing \"Open Farmland with Mango Orchard\" reached 200 views", time: "1 day ago" },
            { text: "Priya Sawant viewed your contact details", time: "1 day ago" },
            { text: "\"Compact Residential Plot in Town\" submitted for review", time: "3 days ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-bright" />
              <div>
                <p className="text-sm text-ink">{item.text}</p>
                <p className="mt-0.5 text-xs text-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border-2 border-navy bg-green-pale p-6 text-center sm:p-8">
        <p className="font-display text-lg font-semibold text-navy">
          List your next plot — it&apos;s free
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">
          Sellers with 2+ active listings get 3x more inquiries on average.
        </p>
      </div>
    </div>
  );
}

function ListingsTab() {
  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-line bg-white">
        {myListings.map((listing, i) => (
          <div
            key={listing.id}
            className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 ${
              i !== myListings.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-md bg-green-pale text-green/40 sm:w-28">
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-navy">{listing.title}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    listing.status === "Live"
                      ? "bg-green-pale text-green"
                      : "bg-amber/20 text-amber-dark"
                  }`}
                >
                  {listing.status}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={13} />
                {listing.locality}, {listing.city} · {formatArea(listing.areaSqft)} ·{" "}
                {formatPrice(listing.priceLakh)}
              </p>
            </div>
            <div className="flex gap-6 text-sm sm:gap-8">
              <div>
                <p className="font-display font-semibold text-navy">{listing.views}</p>
                <p className="coord-label">Views</p>
              </div>
              <div>
                <p className="font-display font-semibold text-navy">{listing.inquiries}</p>
                <p className="coord-label">Inquiries</p>
              </div>
            </div>
            <div className="flex gap-2 sm:flex-col">
              <button className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-green-bright">
                Edit
              </button>
              <button className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-green-bright">
                {listing.status === "Live" ? "Mark sold" : "View status"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddListingTab() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="plot-border flex flex-col items-center gap-3 rounded-lg bg-white p-12 text-center">
        <CheckCircle2 size={40} className="text-green" />
        <h2 className="font-display text-xl font-bold text-navy">Listing submitted for review</h2>
        <p className="max-w-md text-sm text-muted">
          We&apos;ll verify the details and publish your plot within 24 hours. You can track its
          status under &quot;My Listings&quot;.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 rounded-md bg-green px-5 py-2.5 font-semibold text-paper hover:bg-navy"
        >
          Add another plot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Basic details</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-navy">Title</label>
              <input
                required
                type="text"
                placeholder="e.g. NA Plot near Lonavla Lake, Tungarli"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Plot type</label>
              <select required className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright">
                <option value="">Select type</option>
                {plotTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">City</label>
              <select required className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright">
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-navy">Locality / Village</label>
              <input
                required
                type="text"
                placeholder="e.g. Tungarli"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Plot details</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-navy">Area (sqft)</label>
              <input
                required
                type="number"
                placeholder="2400"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Dimensions</label>
              <input
                type="text"
                placeholder="40 x 60 ft"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Facing</label>
              <select className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright">
                <option>East</option>
                <option>West</option>
                <option>North</option>
                <option>South</option>
                <option>North-East</option>
                <option>North-West</option>
                <option>South-East</option>
                <option>South-West</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Road width (ft)</label>
              <input
                type="number"
                placeholder="20"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Zone / NA status</label>
              <input
                type="text"
                placeholder="Residential NA"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Price (₹ Lakh)</label>
              <input
                required
                type="number"
                placeholder="45"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Description</h2>
          <textarea
            rows={4}
            placeholder="Describe the plot — access roads, nearby landmarks, water/electricity availability, title status..."
            className="mt-3 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
          />
        </div>

        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Photos</h2>
          <div className="plot-border mt-3 flex h-32 flex-col items-center justify-center gap-2 rounded-lg bg-green-pale text-green/50">
            <ImageOff size={24} strokeWidth={1.5} />
            <p className="text-sm">Drag and drop photos, or click to upload</p>
            <p className="coord-label">JPG, PNG up to 10MB each</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-navy">Seller contact</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-navy">Your name</label>
              <input
                required
                type="text"
                placeholder="Full name"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">Phone number</label>
              <input
                required
                type="tel"
                placeholder="+91 98XXX XXXXX"
                className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy">I am the</label>
              <select className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright">
                <option>Owner</option>
                <option>Agent</option>
                <option>Builder</option>
              </select>
            </div>
          </div>

          <div className="plot-divider my-5" />

          <p className="flex items-start gap-2 text-xs text-muted">
            <Clock size={14} className="mt-0.5 shrink-0" />
            Listings are reviewed within 24 hours before going live.
          </p>

          <button
            type="submit"
            className="mt-5 w-full rounded-md bg-amber px-4 py-3 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
          >
            Submit listing
          </button>
        </div>
      </div>
    </form>
  );
}

function LeadsTab() {
  const statusStyles: Record<string, string> = {
    New: "bg-amber/20 text-amber-dark",
    Contacted: "bg-green-pale text-green",
    Closed: "bg-line text-muted",
  };

  return (
    <div className="space-y-4">
      {mockLeads.map((lead) => (
        <div key={lead.id} className="rounded-lg border border-line bg-white p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-navy">{lead.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[lead.status]}`}>
                  {lead.status}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted">Re: {lead.plot}</p>
            </div>
            <p className="text-xs text-muted">{lead.time}</p>
          </div>
          <p className="mt-3 text-sm text-ink/80">{lead.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-paper-dim px-3 py-1.5 text-sm font-medium text-navy">
              <Phone size={14} className="text-green" />
              {lead.phone}
            </span>
            <button className="rounded-md bg-green px-3 py-1.5 text-sm font-semibold text-paper hover:bg-navy">
              Call back
            </button>
            <button className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-green-bright">
              Mark contacted
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
