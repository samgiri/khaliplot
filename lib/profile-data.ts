export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

// Curated major cities per state/UT — suggestions only (the City field stays
// free text), so this doesn't need to be exhaustive. Keys match INDIAN_STATES
// exactly. Where a state already appears in lib/locations.ts STATE_REGIONS
// (a different key vocabulary, used for the post-plot listing form), the
// entries here stay consistent with it.
export const STATE_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  "Delhi NCR": ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"],
  Goa: ["Panaji", "Margao", "Goa"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Dholera"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  Ladakh: ["Leh", "Kargil"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  Maharashtra: ["Mumbai", "Navi Mumbai", "Pune", "Nagpur", "Nashik", "Lonavla"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Puri"],
  Puducherry: ["Puducherry"],
  Punjab: ["Ludhiana", "Amritsar", "Chandigarh", "Jalandhar"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Neemrana"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Agra", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri"],
};

export function getCitiesForState(state: string | null | undefined): string[] {
  if (!state) return [];
  return STATE_CITIES[state] ?? [];
}

export const ROLE_OPTIONS = [
  { value: "buyer", label: "Buyer", description: "Looking to buy a plot" },
  { value: "seller", label: "Seller", description: "I own a plot to sell" },
  { value: "broker", label: "Broker", description: "I deal in plots for clients" },
  { value: "builder", label: "Builder", description: "I develop plots / layouts" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
] as const;

export const CONTACT_METHOD_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
] as const;

export type Role = (typeof ROLE_OPTIONS)[number]["value"];
export type Language = (typeof LANGUAGE_OPTIONS)[number]["value"];
export type ContactMethod = (typeof CONTACT_METHOD_OPTIONS)[number]["value"];

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: Role | null;
  state: string | null;
  city: string | null;
  preferred_language: Language | null;
  preferred_contact_method: ContactMethod | null;
}

export function isProfileComplete(
  profile: Pick<Profile, "name" | "phone" | "role" | "state" | "city" | "preferred_language"> | null
): boolean {
  if (!profile) return false;
  return Boolean(
    profile.name?.trim() &&
      profile.phone?.trim() &&
      profile.role &&
      profile.state?.trim() &&
      profile.city?.trim() &&
      profile.preferred_language
  );
}

/** Maps a profile role to the listings table's seller_type vocabulary (Owner/Agent/Builder). */
export function roleToSellerType(role: Role | null | undefined): "Owner" | "Agent" | "Builder" {
  if (role === "broker") return "Agent";
  if (role === "builder") return "Builder";
  return "Owner";
}

export function firstName(name: string | null | undefined): string {
  if (!name) return "";
  return name.trim().split(/\s+/)[0] ?? "";
}

/** Strips a "+91" prefix and any non-digits, leaving the 10-digit local number for editing. */
export function phoneLocalDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 10) return digits;
  return digits.slice(-10);
}
