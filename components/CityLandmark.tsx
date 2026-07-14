import { getCityLandmark } from "@/lib/city-landmarks";

/**
 * Renders a city's landmark emoji, optionally followed by a label.
 * Used inline on plot cards and, larger, on the detail page location section.
 */
export default function CityLandmark({
  city,
  label,
  emojiSize = 16,
  className = "",
}: {
  city: string;
  /** Text shown after the emoji. Defaults to the city name; pass "" for emoji only. */
  label?: string;
  emojiSize?: number;
  className?: string;
}) {
  const emoji = getCityLandmark(city);
  const text = label ?? city;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span aria-hidden="true" style={{ fontSize: emojiSize, lineHeight: 1 }}>
        {emoji}
      </span>
      {text ? <span>{text}</span> : null}
    </span>
  );
}
