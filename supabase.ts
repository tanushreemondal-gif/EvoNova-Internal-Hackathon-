import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = "athlete" | "coach" | "scout";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}
