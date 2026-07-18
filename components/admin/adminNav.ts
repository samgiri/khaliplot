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
  { key: "users", label: "Users", href: "/admin/users", icon: Users, live: true },
  { key: "listings", label: "Listings", href: "/admin/listings", icon: Building2, live: true },
  { key: "transactions", label: "Transactions", href: "/admin/transactions", icon: Wallet, live: true },
  { key: "disputes", label: "Disputes & Fraud", href: "/admin/disputes", icon: AlertTriangle, live: false },
  { key: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3, live: true },
  { key: "content", label: "Content", href: "/admin/content", icon: FileText, live: true },
  { key: "support", label: "Support", href: "/admin/support", icon: LifeBuoy, live: true },
  { key: "reports", label: "Reports", href: "/admin/reports", icon: Megaphone, live: true },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: Settings, live: false },
];

export const PLACEHOLDER_SECTIONS: Record<string, { label: string; description: string }> = {
  disputes: {
    label: "Disputes & Fraud",
    description:
      "Review fraud reports and disputes, contact parties, ban users and issue refunds. Needs a disputes table and reporting flow.",
  },
  settings: {
    label: "Settings & Configuration",
    description:
      "Reveal price, subscription tiers, payment keys, email/SMS providers and feature flags. Needs a settings store.",
  },
};
