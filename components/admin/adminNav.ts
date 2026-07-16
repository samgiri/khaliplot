import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  AlertTriangle,
  BarChart3,
  Settings,
  FileText,
  LifeBuoy,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  live: boolean;
}

// Sidebar sections. `live` ones are backed by real data; the rest render a
// clearly-labelled "coming soon" placeholder for the next iteration.
export const ADMIN_NAV: NavItem[] = [
  { key: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard, live: true },
  { key: "users", label: "Users", href: "/admin/users", icon: Users, live: false },
  { key: "listings", label: "Listings", href: "/admin/listings", icon: Building2, live: true },
  { key: "transactions", label: "Transactions", href: "/admin/transactions", icon: Wallet, live: false },
  { key: "disputes", label: "Disputes & Fraud", href: "/admin/disputes", icon: AlertTriangle, live: false },
  { key: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3, live: false },
  { key: "content", label: "Content", href: "/admin/content", icon: FileText, live: false },
  { key: "support", label: "Support", href: "/admin/support", icon: LifeBuoy, live: false },
  { key: "reports", label: "Reports", href: "/admin/reports", icon: Megaphone, live: false },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: Settings, live: false },
];

export const PLACEHOLDER_SECTIONS: Record<string, { label: string; description: string }> = {
  users: {
    label: "Users Management",
    description:
      "List, search and moderate users — view profiles, transactions and listings, ban or message accounts. Coming next; the profiles data model is already in place.",
  },
  transactions: {
    label: "Transactions & Reveals",
    description:
      "Track every ₹499 contact reveal and Plus subscription, with refunds and dispute flags. Needs the payments (Razorpay) integration before it goes live.",
  },
  disputes: {
    label: "Disputes & Fraud",
    description:
      "Review fraud reports and disputes, contact parties, ban users and issue refunds. Needs a disputes table and reporting flow.",
  },
  analytics: {
    label: "Analytics",
    description:
      "Traffic, signups, listing performance, revenue by source and search-to-reveal conversion. Needs an analytics pipeline; basic counts are already on the Overview.",
  },
  content: {
    label: "Content Management",
    description:
      "Create, edit and publish News articles and FAQs, and send announcements. News currently ships from a seed; a write API comes next.",
  },
  support: {
    label: "Support & Messages",
    description:
      "Support tickets, contact-form submissions and message moderation. Contact-form submissions already land in the inquiries table.",
  },
  reports: {
    label: "Reports & Export",
    description:
      "Scheduled daily/weekly/monthly summaries. Ad-hoc CSV export is already available from the Overview.",
  },
  settings: {
    label: "Settings & Configuration",
    description:
      "Reveal price, subscription tiers, payment keys, email/SMS providers and feature flags. Needs a settings store.",
  },
};
