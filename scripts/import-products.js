/**
 * G-MART Product CSV Import Script
 *
 * Usage:
 *   node scripts/import-products.js <path-to-csv>
 *
 * CSV format:
 *   name,slug,description,price,compare_at_price,images,category_slug,material,dimensions,color,in_stock,featured,rating,review_count
 *
 * Example:
 *   name: "Majestic Oak Dining Table"
 *   slug: "majestic-oak-dining-table"
 *   images: JSON array string: '["https://...", "https://..."]'
 *   category_slug: Must match an existing category slug in the DB
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node scripts/import-products.js <path-to-csv>");
    process.exit(1);
  }

  // Load categories to map slug -> id
  const { data: categories } = await supabase.from("categories").select("id, slug");
  const catMap = {};
  categories.forEach((c) => (catMap[c.slug] = c.id));

  // Read CSV
  const raw = fs.readFileSync(path.resolve(csvPath), "utf-8");
  const lines = raw.trim().split("\n");
  const headers = lines[0].split(",");

  const products = lines.slice(1).map((line) => {
    const vals = line.split(",");
    const row = {};
    headers.forEach((h, i) => (row[h.trim()] = vals[i]?.trim()));
    return row;
  });

  let inserted = 0;
  for (const p of products) {
    const categoryId = catMap[p.category_slug];
    if (!categoryId) {
      console.warn(`Skipping "${p.name}": unknown category "${p.category_slug}"`);
      continue;
    }

    const { error } = await supabase.from("products").upsert(
      {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: parseInt(p.price),
        compare_at_price: p.compare_at_price ? parseInt(p.compare_at_price) : null,
        images: JSON.parse(p.images || "[]"),
        category_id: categoryId,
        material: p.material || null,
        dimensions: p.dimensions || null,
        color: p.color || null,
        in_stock: p.in_stock !== "false",
        featured: p.featured === "true",
        rating: parseFloat(p.rating || "0"),
        review_count: parseInt(p.review_count || "0"),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Error inserting "${p.name}":`, error.message);
    } else {
      inserted++;
    }
  }

  console.log(`Done. Inserted/updated ${inserted} products.`);
}

main().catch(console.error);
