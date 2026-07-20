import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(import.meta.dirname, "..", ".env.local");
  if (!existsSync(envPath)) {
    console.error("❌ .env.local not found. Create one with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/setup-first-admin.mjs <email>");
    process.exit(1);
  }

  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local");
    process.exit(1);
  }
  if (!serviceRoleKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
    console.error("   Add it: SUPABASE_SERVICE_ROLE_KEY=eyJ...");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log(`🔍 Looking up user: ${email}...`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("❌ Failed to list users:", listError.message);
    process.exit(1);
  }

  const user = users?.find((u) => u.email === email);
  if (!user) {
    console.error(`❌ User "${email}" not found in Supabase Auth.`);
    console.error("   Register first at https://g-mart-rakesh15.vercel.app/auth/register");
    process.exit(1);
  }

  console.log(`✅ Found user: ${user.id} (${user.email})`);

  const { data: existing } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    console.log(`ℹ️  ${email} is already an admin. No changes needed.`);
    process.exit(0);
  }

  const { error: insertError } = await supabase
    .from("admins")
    .insert({ user_id: user.id });

  if (insertError) {
    console.error("❌ Failed to insert admin:", insertError.message);
    process.exit(1);
  }

  console.log(`✅ ${email} is now an admin!`);
  console.log("   Login at https://g-mart-rakesh15.vercel.app/auth/login");
  console.log("   Dashboard at https://g-mart-rakesh15.vercel.app/admin");
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
