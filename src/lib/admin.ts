import { getApiSupabase } from "./supabase";

export async function requireAdmin(request: Request): Promise<{ error?: string; status?: number } | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await getApiSupabase().auth.getUser(token);

  if (authError || !user) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: admin } = await getApiSupabase()
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return { error: "Forbidden: Admin access required", status: 403 };
  }

  return null;
}

export async function isAdmin(token: string): Promise<boolean> {
  try {
    const { data: { user } } = await getApiSupabase().auth.getUser(token);
    if (!user) return false;

    const { data: admin } = await getApiSupabase()
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    return !!admin;
  } catch {
    return false;
  }
}

export async function isAdminFromRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return isAdmin(authHeader.slice(7));
}
