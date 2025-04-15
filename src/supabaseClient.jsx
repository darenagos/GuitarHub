import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
