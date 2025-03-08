import supabase from "../utils/supabase";

export const getPlans = async () => {
  const { data, error } = await supabase
    .from("Plan")
    .select("*")
    .eq("isActive", true)
    .order("price", { ascending: true });

  if (error) throw error;
  return data;
};
