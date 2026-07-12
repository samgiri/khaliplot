import { formatArea, formatPrice } from "@/lib/data";
import { unitLabel, type AreaUnit } from "@/lib/listing-units";

export interface DescriptionInput {
  title?: string;
  plotType: string;
  city: string;
  state: string;
  locality?: string;
  areaSqft: number;
  areaValue: number;
  areaUnit: AreaUnit;
  priceLakh: number;
  naStatus?: string | null;
  hint?: string;
}

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";

function buildPrompt(input: DescriptionInput): string {
  const parts = [
    `Plot type: ${input.plotType}`,
    `Location: ${[input.locality, input.city, input.state].filter(Boolean).join(", ")}`,
    `Size: ${input.areaValue} ${unitLabel(input.areaUnit)} (${formatArea(input.areaSqft)})`,
    `Price: ${formatPrice(input.priceLakh)}`,
  ];
  if (input.naStatus) parts.push(`NA / land-use converted: ${input.naStatus}`);
  if (input.hint) parts.push(`Seller notes (may be in English or Hindi): ${input.hint}`);

  return (
    "Write a professional, factual 80-120 word listing description for a plot-of-land " +
    "marketplace, in English, based on these details. No exaggerated claims, no emojis, " +
    "no headings — plain prose paragraphs only.\n\n" +
    parts.join("\n")
  );
}

async function callAnthropic(input: DescriptionInput): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 400,
        messages: [{ role: "user", content: buildPrompt(input) }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function templateDescription(input: DescriptionInput): string {
  const location = [input.locality, input.city, input.state].filter(Boolean).join(", ");
  const size = `${input.areaValue} ${unitLabel(input.areaUnit)} (${formatArea(input.areaSqft)})`;
  const price = formatPrice(input.priceLakh);

  const naLine =
    input.naStatus === "Yes"
      ? " The plot is NA (non-agricultural) converted, ready for construction."
      : input.naStatus === "No"
        ? " NA conversion is pending — buyers should factor this into their plans."
        : "";

  const hintLine = input.hint ? ` ${input.hint.trim().replace(/\s+/g, " ")}.` : "";

  return (
    `A ${input.plotType.toLowerCase()} plot spanning ${size}, located in ${location}.` +
    naLine +
    hintLine +
    ` Priced at ${price}, this plot offers a solid opportunity for buyers looking in the ${input.city} market. ` +
    `Contact the seller directly through KhaliPlot for more details, site visits and documentation — ` +
    `no brokerage, no middlemen.`
  );
}

export async function generateListingDescription(
  input: DescriptionInput
): Promise<{ text: string; source: "ai" | "template" }> {
  const aiText = await callAnthropic(input);
  if (aiText) return { text: aiText, source: "ai" };
  return { text: templateDescription(input), source: "template" };
}
