// Maps a city to a recognisable landmark emoji, shown next to the city name
// on plot cards, the filter dropdown and the detail page. Emojis keep this
// zero-asset and instantly readable for Indian buyers.

const CITY_LANDMARKS: Record<string, string> = {
  // Delhi NCR belt → India Gate
  Delhi: "🏛️",
  "Delhi NCR": "🏛️",
  NCR: "🏛️",
  Gurgaon: "🏛️",
  Noida: "🏛️",
  // Mumbai belt → Gateway of India
  Mumbai: "🌉",
  "Navi Mumbai": "🌉",
  // Individually mapped landmarks
  Pune: "🏰", // Aga Khan Palace
  Jaipur: "🏯", // Hawa Mahal
  Bengaluru: "🏢", // Vidhana Soudha
  Goa: "⛪", // Basilica of Bom Jesus
  Dholera: "🏗️", // greenfield smart city
  Neemrana: "🏰", // Neemrana Fort-Palace
  Hyderabad: "🕌", // Charminar
  Lonavla: "🏞️", // hill station
};

const DEFAULT_LANDMARK = "🏘️";

/** Landmark emoji for a city (falls back to a generic settlement icon). */
export function getCityLandmark(city: string | null | undefined): string {
  if (!city) return DEFAULT_LANDMARK;
  return CITY_LANDMARKS[city] ?? DEFAULT_LANDMARK;
}
