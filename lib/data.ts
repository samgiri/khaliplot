export type PlotType =
  | "Residential"
  | "Agricultural"
  | "Commercial"
  | "Farmhouse"
  | "Industrial";

export interface Listing {
  id: string;
  title: string;
  plotType: PlotType;
  city: string;
  locality: string;
  state: string;
  areaSqft: number;
  priceLakh: number; // price in lakh INR
  pricePerSqft: number;
  facing: string;
  roadWidthFt: number;
  dimensions: string; // e.g. "60 x 40 ft"
  zone: string;
  features: string[];
  description: string;
  postedDaysAgo: number;
  verified: boolean;
  sellerName: string;
  sellerType: "Owner" | "Agent" | "Builder";
  sellerPhone: string;
  coordinates: { lat: number; lng: number };
  images: number; // count placeholder
}

export const listings: Listing[] = [
  {
    id: "kp-lonavla-001",
    title: "Hillside NA Plot near Lonavla Lake",
    plotType: "Residential",
    city: "Lonavla",
    locality: "Tungarli",
    state: "Maharashtra",
    areaSqft: 4500,
    priceLakh: 67.5,
    pricePerSqft: 1500,
    facing: "East",
    roadWidthFt: 24,
    dimensions: "75 x 60 ft",
    zone: "NA Residential",
    features: ["Gated community", "Lake view", "Water connection", "Electricity on site"],
    description:
      "A north-east facing NA plot tucked in the hills of Tungarli, a 10-minute drive from Lonavla Lake. The plot sits in an approved layout with wide internal roads and is ready for construction with all conversion paperwork in place.",
    postedDaysAgo: 2,
    verified: true,
    sellerName: "Suresh Patil",
    sellerType: "Owner",
    sellerPhone: "+91 98XXX XX234",
    coordinates: { lat: 18.7546, lng: 73.4062 },
    images: 6,
  },
  {
    id: "kp-lonavla-002",
    title: "Open Farmland with Mango Orchard",
    plotType: "Agricultural",
    city: "Lonavla",
    locality: "Kune Village",
    state: "Maharashtra",
    areaSqft: 87120, // 2 acres
    priceLakh: 95,
    pricePerSqft: 109,
    facing: "North",
    roadWidthFt: 12,
    dimensions: "2 Acres",
    zone: "Agricultural",
    features: ["30+ mango trees", "Borewell", "Mud road access", "Hill backdrop"],
    description:
      "Two acres of fertile agricultural land near Kune village, planted with mature mango and chikoo trees. A seasonal stream runs along the northern boundary. Ideal for a weekend farm or organic farming venture.",
    postedDaysAgo: 6,
    verified: true,
    sellerName: "Vitthal Shinde",
    sellerType: "Owner",
    sellerPhone: "+91 97XXX XX812",
    coordinates: { lat: 18.7281, lng: 73.391 },
    images: 5,
  },
  {
    id: "kp-pune-001",
    title: "Corner Plot on Highway, Near IT Park",
    plotType: "Commercial",
    city: "Pune",
    locality: "Hinjawadi Phase 3",
    state: "Maharashtra",
    areaSqft: 6000,
    priceLakh: 480,
    pricePerSqft: 8000,
    facing: "North-East",
    roadWidthFt: 40,
    dimensions: "100 x 60 ft",
    zone: "Commercial",
    features: ["Highway facing", "High footfall", "Near metro line", "Commercial NA"],
    description:
      "Premium corner commercial plot on the main Hinjawadi–Wakad road, 800m from the upcoming metro station. Suitable for showroom, office complex or retail development. Heavy daily footfall from IT crowd.",
    postedDaysAgo: 1,
    verified: true,
    sellerName: "Kunal Deshmukh",
    sellerType: "Agent",
    sellerPhone: "+91 98XXX XX120",
    coordinates: { lat: 18.5908, lng: 73.7392 },
    images: 8,
  },
  {
    id: "kp-pune-002",
    title: "Ready-to-Build Plot in Gated Layout",
    plotType: "Residential",
    city: "Pune",
    locality: "Bavdhan",
    state: "Maharashtra",
    areaSqft: 2400,
    priceLakh: 144,
    pricePerSqft: 6000,
    facing: "South",
    roadWidthFt: 30,
    dimensions: "40 x 60 ft",
    zone: "Residential NA",
    features: ["Gated layout", "Underground drainage", "Streetlights", "Clubhouse"],
    description:
      "Well-planned plot inside a 40-acre gated township in Bavdhan with underground utilities, paver roads and a clubhouse already operational. Close to schools and the Mumbai-Bangalore highway.",
    postedDaysAgo: 4,
    verified: true,
    sellerName: "Anjali Construction",
    sellerType: "Builder",
    sellerPhone: "+91 99XXX XX556",
    coordinates: { lat: 18.5089, lng: 73.7768 },
    images: 7,
  },
  {
    id: "kp-pune-003",
    title: "Investment Plot near Ring Road",
    plotType: "Residential",
    city: "Pune",
    locality: "Urse",
    state: "Maharashtra",
    areaSqft: 3000,
    priceLakh: 54,
    pricePerSqft: 1800,
    facing: "West",
    roadWidthFt: 20,
    dimensions: "50 x 60 ft",
    zone: "Residential NA",
    features: ["Near ring road", "Appreciating zone", "Clear title", "7/12 verified"],
    description:
      "Affordable NA plot in Urse, directly impacted by the upcoming Pune Ring Road alignment. Clear and marketable title with all documents verified. Good for long-term appreciation.",
    postedDaysAgo: 9,
    verified: true,
    sellerName: "Ramesh Jadhav",
    sellerType: "Owner",
    sellerPhone: "+91 96XXX XX330",
    coordinates: { lat: 18.7235, lng: 73.5829 },
    images: 4,
  },
  {
    id: "kp-nashik-001",
    title: "Vineyard-Ready Agricultural Land",
    plotType: "Agricultural",
    city: "Nashik",
    locality: "Dindori Road",
    state: "Maharashtra",
    areaSqft: 130680, // 3 acres
    priceLakh: 78,
    pricePerSqft: 60,
    facing: "East",
    roadWidthFt: 18,
    dimensions: "3 Acres",
    zone: "Agricultural",
    features: ["Drip irrigation ready", "Borewell + bore pump", "Near wineries", "Fertile red soil"],
    description:
      "Three acres of red soil farmland on Dindori Road, the heart of Nashik's wine country. Currently used for grape cultivation with drip irrigation infrastructure already laid. Excellent soil and water table.",
    postedDaysAgo: 12,
    verified: true,
    sellerName: "Bharat Pawar",
    sellerType: "Owner",
    sellerPhone: "+91 95XXX XX441",
    coordinates: { lat: 20.0382, lng: 73.7466 },
    images: 6,
  },
  {
    id: "kp-nashik-002",
    title: "Riverside Farmhouse Plot",
    plotType: "Farmhouse",
    city: "Nashik",
    locality: "Igatpuri",
    state: "Maharashtra",
    areaSqft: 21780, // 0.5 acre
    priceLakh: 42,
    pricePerSqft: 193,
    facing: "North",
    roadWidthFt: 15,
    dimensions: "0.5 Acre",
    zone: "NA Farmhouse",
    features: ["River frontage", "Hill view", "Approach road", "Fruit trees"],
    description:
      "Half-acre plot bordering a seasonal river in Igatpuri with views of the Western Ghats. Already has a few jackfruit and coconut trees. Suitable for a weekend farmhouse retreat near Mumbai-Nashik highway.",
    postedDaysAgo: 15,
    verified: false,
    sellerName: "Meena Travels & Properties",
    sellerType: "Agent",
    sellerPhone: "+91 94XXX XX772",
    coordinates: { lat: 19.6964, lng: 73.5626 },
    images: 5,
  },
  {
    id: "kp-lonavla-003",
    title: "Compact Residential Plot in Town",
    plotType: "Residential",
    city: "Lonavla",
    locality: "Shivaji Nagar",
    state: "Maharashtra",
    areaSqft: 1800,
    priceLakh: 45,
    pricePerSqft: 2500,
    facing: "East",
    roadWidthFt: 18,
    dimensions: "36 x 50 ft",
    zone: "Residential",
    features: ["Walking distance to station", "Municipal water", "Existing boundary wall"],
    description:
      "Compact plot in the heart of Lonavla town, walking distance to the railway station and main market. Boundary wall already constructed. Ideal for a small home or guesthouse given the tourist footfall.",
    postedDaysAgo: 3,
    verified: true,
    sellerName: "Pooja Realtors",
    sellerType: "Agent",
    sellerPhone: "+91 93XXX XX905",
    coordinates: { lat: 18.7506, lng: 73.4071 },
    images: 4,
  },
];

export const cities = ["Lonavla", "Pune", "Nashik"] as const;

export const plotTypes: PlotType[] = [
  "Residential",
  "Agricultural",
  "Commercial",
  "Farmhouse",
  "Industrial",
];

export function formatPrice(priceLakh: number): string {
  if (priceLakh >= 100) {
    const crore = priceLakh / 100;
    return `₹${crore.toFixed(crore % 1 === 0 ? 0 : 2)} Cr`;
  }
  return `₹${priceLakh.toFixed(priceLakh % 1 === 0 ? 0 : 1)} Lakh`;
}

export function formatArea(sqft: number): string {
  if (sqft >= 43560) {
    const acres = sqft / 43560;
    return `${acres.toFixed(acres % 1 === 0 ? 0 : 2)} Acre${acres > 1 ? "s" : ""}`;
  }
  return `${sqft.toLocaleString("en-IN")} sqft`;
}

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}
