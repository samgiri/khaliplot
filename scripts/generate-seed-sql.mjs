/**
 * Generates supabase/seed.sql from the mock listings in lib/data.ts.
 * Run with: node scripts/generate-seed-sql.mjs
 */
import { listings } from "../lib/data.ts";
import { writeFileSync } from "fs";

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(",");
  return `'{${items}}'`;
}

const rows = listings.map((l) => {
  return `(
  ${sqlString(l.id)},
  ${sqlString(l.title)},
  ${sqlString(l.plotType)},
  ${sqlString(l.city)},
  ${sqlString(l.locality)},
  ${sqlString(l.state)},
  ${l.areaSqft},
  ${l.priceLakh},
  ${l.pricePerSqft},
  ${sqlString(l.facing)},
  ${l.roadWidthFt},
  ${sqlString(l.dimensions)},
  ${sqlString(l.zone)},
  ${sqlArray(l.features)},
  ${sqlString(l.description)},
  ${l.verified},
  'live',
  ${sqlString(l.sellerName)},
  ${sqlString(l.sellerType)},
  ${sqlString(l.sellerPhone)},
  ${l.coordinates.lat},
  ${l.coordinates.lng},
  ${l.images}
)`;
});

const sql = `-- Auto-generated seed data from lib/data.ts
-- Run this in Supabase SQL Editor AFTER running schema.sql

insert into listings (
  id, title, plot_type, city, locality, state, area_sqft, price_lakh,
  price_per_sqft, facing, road_width_ft, dimensions, zone, features,
  description, verified, status, seller_name, seller_type, seller_phone,
  lat, lng, images
) values
${rows.join(",\n")}
on conflict (id) do nothing;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`Generated supabase/seed.sql with ${listings.length} listings`);
