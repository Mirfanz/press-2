import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SB_PROJECT_URL,
  process.env.NEXT_PUBLIC_SB_PUBLIC_KEY,
);
