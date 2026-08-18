import { createClient } from "@supabase/supabase-js";
export const ADMIN_UID = "b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab";
export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL || "https://lyclaplowwxocbuuigyu.supabase.co", process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_NSfTkSfWYK03EAlM6Vo4Ug_1cCyf57W", { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
