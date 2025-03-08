import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  config.public.supabase.url,
  config.public.supabase.key
);

export default supabase;
