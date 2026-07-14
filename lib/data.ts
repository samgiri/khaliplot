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
  sellerId?: string | null;
  status?: string;
  mapsLink?: string | null;
  areaUnit?: string;
  areaValue?: number | null;
  pricePerUnit?: number | null;
  ownershipType?: string | null;
  transactionType?: string | null;
  naStatus?: string | null;
  documents?: import("./listing-form-data").ListingDocuments;
  cornerPlot?: boolean | null;
  boundaryWall?: boolean | null;
  gatedLayout?: boolean | null;
  possession?: string | null;
  photoUrls?: string[];
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
    documents: { title_clear: true, rera_registered: true, land_record: true },
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
  {
    id: "kp-mumbai-001",
    title: "Sea-Facing Plot in Upcoming Township",
    plotType: "Residential",
    city: "Mumbai",
    locality: "Panvel",
    state: "Maharashtra",
    areaSqft: 3200,
    priceLakh: 320,
    pricePerSqft: 10000,
    facing: "West",
    roadWidthFt: 36,
    dimensions: "40 x 80 ft",
    zone: "Residential NA",
    features: ["Sea-facing", "Near upcoming airport", "Gated township", "Clear title"],
    description:
      "Premium NA plot in a master-planned township near Navi Mumbai International Airport, with partial sea views. Roads, drainage and electricity already laid out across the layout.",
    postedDaysAgo: 3,
    verified: true,
    sellerName: "Coastal Estates",
    sellerType: "Builder",
    sellerPhone: "+91 98XXX XX671",
    coordinates: { lat: 18.9894, lng: 73.1175 },
    images: 9,
  },
  {
    id: "kp-pune-004",
    title: "Warehouse Plot near Logistics Park",
    plotType: "Industrial",
    city: "Pune",
    locality: "Chakan",
    state: "Maharashtra",
    areaSqft: 21780, // 0.5 acre
    priceLakh: 110,
    pricePerSqft: 505,
    facing: "East",
    roadWidthFt: 60,
    dimensions: "0.5 Acre",
    zone: "Industrial",
    features: ["Highway access", "Near auto manufacturing hub", "Power connection ready", "MIDC approved"],
    description:
      "MIDC-approved industrial plot in Chakan, close to major auto manufacturing plants and the Pune-Nashik highway. Suitable for warehousing, logistics or light manufacturing.",
    postedDaysAgo: 7,
    verified: true,
    sellerName: "Chakan Industrial Estate",
    sellerType: "Agent",
    sellerPhone: "+91 99XXX XX204",
    coordinates: { lat: 18.7553, lng: 73.8612 },
    images: 5,
  },
  {
    id: "kp-delhi-001",
    title: "Farmhouse Plot on Gurgaon-Sohna Road",
    plotType: "Farmhouse",
    city: "Gurgaon",
    locality: "Sohna Road",
    state: "Haryana",
    areaSqft: 87120, // 2 acres
    priceLakh: 850,
    pricePerSqft: 976,
    facing: "North",
    roadWidthFt: 40,
    dimensions: "2 Acres",
    zone: "NA Farmhouse",
    features: ["Aravalli hill view", "Gated farmhouse colony", "Borewell", "24x7 security"],
    description:
      "Two-acre farmhouse plot in a premium gated colony off Sohna Road, with Aravalli hill views and existing greenery. Popular weekend-home belt for Delhi-NCR buyers.",
    postedDaysAgo: 5,
    verified: true,
    sellerName: "NCR Land Co.",
    sellerType: "Agent",
    sellerPhone: "+91 97XXX XX318",
    coordinates: { lat: 28.3789, lng: 77.0497 },
    images: 7,
  },
  {
    id: "kp-delhi-002",
    title: "Commercial Plot near Dwarka Expressway",
    plotType: "Commercial",
    city: "Gurgaon",
    locality: "Sector 99",
    state: "Haryana",
    areaSqft: 4500,
    priceLakh: 675,
    pricePerSqft: 15000,
    facing: "South",
    roadWidthFt: 50,
    dimensions: "75 x 60 ft",
    zone: "Commercial",
    features: ["Dwarka Expressway frontage", "High visibility", "Mixed-use zoning", "Metro connectivity planned"],
    description:
      "Commercial plot with direct frontage on Dwarka Expressway, in a rapidly developing sector with several residential towers nearby. Suitable for retail, office or mixed-use development.",
    postedDaysAgo: 2,
    verified: true,
    sellerName: "Capital Realty Partners",
    sellerType: "Agent",
    sellerPhone: "+91 96XXX XX902",
    coordinates: { lat: 28.4732, lng: 76.9794 },
    images: 6,
  },
  {
    id: "kp-bengaluru-001",
    title: "BMRDA-Approved Plot near Tech Corridor",
    plotType: "Residential",
    city: "Bengaluru",
    locality: "Sarjapur Road",
    state: "Karnataka",
    areaSqft: 2400,
    priceLakh: 168,
    pricePerSqft: 7000,
    facing: "East",
    roadWidthFt: 30,
    dimensions: "30 x 80 ft",
    zone: "Residential BMRDA",
    features: ["BMRDA approved", "Near IT corridor", "Clubhouse layout", "Underground utilities"],
    description:
      "BMRDA-approved plot in a gated layout on Sarjapur Road, close to major tech parks. Layout includes underground drainage, paver roads and a clubhouse under construction.",
    postedDaysAgo: 4,
    verified: true,
    sellerName: "Sarjapur Greens Pvt Ltd",
    sellerType: "Builder",
    sellerPhone: "+91 95XXX XX663",
    coordinates: { lat: 12.9081, lng: 77.6873 },
    images: 8,
  },
  {
    id: "kp-bengaluru-002",
    title: "Agricultural Land near Nandi Hills",
    plotType: "Agricultural",
    city: "Bengaluru",
    locality: "Devanahalli",
    state: "Karnataka",
    areaSqft: 65340, // 1.5 acres
    priceLakh: 90,
    pricePerSqft: 138,
    facing: "North-East",
    roadWidthFt: 16,
    dimensions: "1.5 Acres",
    zone: "Agricultural",
    features: ["Near Nandi Hills", "Borewell", "Coconut plantation", "Near airport"],
    description:
      "1.5 acres of agricultural land near Devanahalli, within easy reach of Kempegowda International Airport and Nandi Hills. Currently has a mature coconut plantation and functioning borewell.",
    postedDaysAgo: 10,
    verified: false,
    sellerName: "Lakshmi Devaraj",
    sellerType: "Owner",
    sellerPhone: "+91 94XXX XX519",
    coordinates: { lat: 13.2437, lng: 77.6907 },
    images: 4,
  },
  {
    id: "kp-jaipur-001",
    title: "Heritage-Zone Residential Plot",
    plotType: "Residential",
    city: "Jaipur",
    locality: "Vaishali Nagar",
    state: "Rajasthan",
    areaSqft: 1800,
    priceLakh: 54,
    pricePerSqft: 3000,
    facing: "East",
    roadWidthFt: 24,
    dimensions: "30 x 60 ft",
    zone: "Residential",
    features: ["JDA approved", "Near shopping malls", "Water & sewer connected", "Wide road"],
    description:
      "JDA-approved residential plot in the established Vaishali Nagar locality, close to malls, schools and hospitals. All utility connections already in place.",
    postedDaysAgo: 6,
    verified: true,
    sellerName: "Rajendra Sharma",
    sellerType: "Owner",
    sellerPhone: "+91 93XXX XX247",
    coordinates: { lat: 26.9115, lng: 75.7392 },
    images: 5,
    documents: { title_clear: true, land_record: true },
  },
  {
    id: "kp-jaipur-002",
    title: "Farmland with Aravalli Views",
    plotType: "Agricultural",
    city: "Jaipur",
    locality: "Chaksu",
    state: "Rajasthan",
    areaSqft: 217800, // 5 acres
    priceLakh: 60,
    pricePerSqft: 28,
    facing: "South",
    roadWidthFt: 14,
    dimensions: "5 Acres",
    zone: "Agricultural",
    features: ["Aravalli range views", "Tubewell", "Mustard fields", "Mud road access"],
    description:
      "Five acres of farmland near Chaksu with views of the Aravalli range, currently cultivated with mustard and bajra. Tubewell installed and functioning. Good for large-scale farming or future land banking.",
    postedDaysAgo: 14,
    verified: true,
    sellerName: "Mohan Lal Yadav",
    sellerType: "Owner",
    sellerPhone: "+91 92XXX XX835",
    coordinates: { lat: 26.5993, lng: 75.9508 },
    images: 3,
  },
  {
    id: "kp-navimumbai-001",
    title: "Plot near Navi Mumbai International Airport",
    plotType: "Residential",
    city: "Navi Mumbai",
    locality: "Ulwe",
    state: "Maharashtra",
    areaSqft: 2700,
    priceLakh: 270,
    pricePerSqft: 10000,
    facing: "East",
    roadWidthFt: 30,
    dimensions: "45 x 60 ft",
    zone: "Residential NA",
    features: ["Near new airport", "CIDCO layout", "Metro line planned", "High appreciation zone"],
    description:
      "NA plot in Ulwe, within a CIDCO-developed layout and just a few kilometers from the upcoming Navi Mumbai International Airport. One of the most actively traded land markets in the region given the airport-led growth.",
    postedDaysAgo: 1,
    verified: true,
    sellerName: "CIDCO Land Brokers",
    sellerType: "Agent",
    sellerPhone: "+91 98XXX XX014",
    coordinates: { lat: 18.9894, lng: 73.0179 },
    images: 6,
  },
  {
    id: "kp-navimumbai-002",
    title: "Commercial Plot on Sion-Panvel Highway",
    plotType: "Commercial",
    city: "Navi Mumbai",
    locality: "Kharghar",
    state: "Maharashtra",
    areaSqft: 5400,
    priceLakh: 810,
    pricePerSqft: 15000,
    facing: "West",
    roadWidthFt: 45,
    dimensions: "90 x 60 ft",
    zone: "Commercial",
    features: ["Highway frontage", "Near Kharghar Central Park", "High footfall", "Metro connectivity"],
    description:
      "Commercial plot with direct frontage on the Sion-Panvel Highway in Kharghar, close to the central business district and metro station. Suited for retail, hospitality or office development.",
    postedDaysAgo: 8,
    verified: true,
    sellerName: "Kharghar Estates",
    sellerType: "Builder",
    sellerPhone: "+91 97XXX XX566",
    coordinates: { lat: 19.0474, lng: 73.0699 },
    images: 7,
  },
  {
    id: "kp-dholera-001",
    title: "SIR-Approved Residential Plot in Dholera SIR",
    plotType: "Residential",
    city: "Dholera",
    locality: "Dholera SIR, Sector 9",
    state: "Gujarat",
    areaSqft: 1800,
    priceLakh: 18,
    pricePerSqft: 1000,
    facing: "North",
    roadWidthFt: 18,
    dimensions: "30 x 60 ft",
    zone: "Residential SIR",
    features: ["Inside Dholera SIR boundary", "Near upcoming airport", "Govt-approved layout", "Title clear"],
    description:
      "Residential plot within India's first greenfield Special Investment Region (SIR), near the planned Dholera International Airport and the Delhi-Mumbai Industrial Corridor. Early-stage entry point in a government-backed smart city development.",
    postedDaysAgo: 5,
    verified: true,
    sellerName: "Dholera Land Ventures",
    sellerType: "Agent",
    sellerPhone: "+91 99XXX XX381",
    coordinates: { lat: 22.2493, lng: 72.1909 },
    images: 4,
  },
  {
    id: "kp-dholera-002",
    title: "Industrial Land near Dholera Activation Area",
    plotType: "Industrial",
    city: "Dholera",
    locality: "Dholera SIR, Sector 14",
    state: "Gujarat",
    areaSqft: 217800, // 5 acres
    priceLakh: 125,
    pricePerSqft: 57,
    facing: "South",
    roadWidthFt: 30,
    dimensions: "5 Acres",
    zone: "Industrial SIR",
    features: ["DMIC corridor", "Near activation area", "Flat terrain", "Govt infrastructure planned"],
    description:
      "Five acres of industrial-zoned land in Dholera SIR's activation area, part of the Delhi-Mumbai Industrial Corridor. Flat, well-connected terrain earmarked for manufacturing and logistics development as the smart city rolls out.",
    postedDaysAgo: 11,
    verified: true,
    sellerName: "Gujarat Industrial Plots Co.",
    sellerType: "Agent",
    sellerPhone: "+91 96XXX XX709",
    coordinates: { lat: 22.2367, lng: 72.1654 },
    images: 5,
  },
  {
    id: "kp-goa-001",
    title: "Beach-Adjacent Plot in North Goa",
    plotType: "Residential",
    city: "Goa",
    locality: "Assagao",
    state: "Goa",
    areaSqft: 4000,
    priceLakh: 320,
    pricePerSqft: 8000,
    facing: "West",
    roadWidthFt: 20,
    dimensions: "0.09 Acres x 1",
    zone: "Residential Settlement Zone",
    features: ["10-min from Anjuna beach", "Coconut grove", "Settlement zone", "Popular with NRI buyers"],
    description:
      "Plot in a quiet pocket of Assagao, North Goa's most sought-after village for boutique villas and cafes. Settlement-zone land surrounded by coconut groves, a short drive from Anjuna and Vagator beaches. Strong demand from NRI and lifestyle buyers.",
    postedDaysAgo: 3,
    verified: true,
    sellerName: "Goa Coastal Properties",
    sellerType: "Agent",
    sellerPhone: "+91 95XXX XX247",
    coordinates: { lat: 15.5937, lng: 73.7726 },
    images: 8,
  },
  {
    id: "kp-goa-002",
    title: "Riverfront Farmland in South Goa",
    plotType: "Agricultural",
    city: "Goa",
    locality: "Cortalim",
    state: "Goa",
    areaSqft: 43560, // 1 acre
    priceLakh: 85,
    pricePerSqft: 195,
    facing: "East",
    roadWidthFt: 14,
    dimensions: "1 Acre",
    zone: "Agricultural / Orchard",
    features: ["Zuari river frontage", "Cashew & mango trees", "Quiet village setting", "30 min from Panaji"],
    description:
      "One acre of riverfront farmland in Cortalim along the Zuari river, planted with cashew and mango trees. A peaceful South Goa setting roughly 30 minutes from Panaji — well suited for a farm retreat or long-term land holding.",
    postedDaysAgo: 9,
    verified: false,
    sellerName: "Maria Fernandes",
    sellerType: "Owner",
    sellerPhone: "+91 94XXX XX602",
    coordinates: { lat: 15.3953, lng: 73.9143 },
    images: 5,
  },
];

export const cities = [
  "Mumbai",
  "Navi Mumbai",
  "Pune",
  "Delhi NCR",
  "Gurgaon",
  "Noida",
  "Neemrana",
  "Jaipur",
  "Lonavla",
  "Nashik",
  "Dholera",
  "Bengaluru",
  "Hyderabad",
  "Goa",
] as const;

export const plotTypes: PlotType[] = [
  "Residential",
  "Agricultural",
  "Commercial",
  "Farmhouse",
  "Industrial",
];

export function formatPrice(priceLakh: number): string {
  if (priceLakh >= 100) {
    // Round to 2 decimals then drop trailing zeros: 1.20 -> "1.2", 4.80 -> "4.8".
    const crore = Math.round((priceLakh / 100) * 100) / 100;
    return `₹${crore} Cr`;
  }
  return `₹${priceLakh.toFixed(priceLakh % 1 === 0 ? 0 : 1)} Lakh`;
}

/**
 * Joins location parts (locality, city, state, ...), dropping empties and
 * de-duplicating case-insensitively. Needed because "Delhi NCR" is valid
 * as both a city and a state value — without this, a listing there renders
 * as "Dwarka More, Delhi NCR, Delhi NCR".
 */
export function formatLocation(...parts: (string | null | undefined)[]): string {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of parts) {
    const trimmed = part?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result.join(", ");
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
