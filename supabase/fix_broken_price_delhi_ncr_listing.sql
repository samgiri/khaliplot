-- Fixes the one listing broken by the post-plot price bug: the seller typed
-- "52" meaning ₹52 Lakh into a field that was (incorrectly) treated as raw
-- rupees, so the row ended up with price_lakh ≈ 0.00052 and a tiny
-- price_per_sqft (≈ ₹0.026/sqft) instead of the intended ₹52,00,000 total.
--
-- STEP 1 — run this first and confirm it returns exactly the one listing
-- you're expecting (Delhi NCR, sale deed ticked, suspiciously low price):
select id, title, city, state, area_sqft, area_value, area_unit,
       price_lakh, price_per_sqft, price_per_unit, documents
from listings
where city = 'Delhi NCR'
  and (documents->>'sale_deed')::boolean is true
  and price_lakh < 1;

-- STEP 2 — only run this if step 1 returned exactly that one row. Sets the
-- corrected total to ₹52,00,000 (₹52 Lakh) and recomputes price_per_sqft /
-- price_per_unit from the row's own area figures, so it's correct
-- regardless of the exact area_sqft/area_value on this row.
update listings
set
  price_lakh = 52,
  price_per_sqft = 5200000.0 / area_sqft,
  price_per_unit = 5200000.0 / coalesce(nullif(area_value, 0), area_sqft)
where city = 'Delhi NCR'
  and (documents->>'sale_deed')::boolean is true
  and price_lakh < 1
returning id, title, city, price_lakh, price_per_sqft, price_per_unit;
