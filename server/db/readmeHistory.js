import supabase from "../utils/supabase";
import { createApiError, ErrorTypes } from "../utils/errorHandler";

export const getUserReadmeHistory = async (userId) => {
  const { data, error } = await supabase
    .from("ReadmeOperation")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

export const createReadmeHistory = async (
  userId,
  repositoryId,
  repositoryName,
  operationType,
  status
) => {
  try {
    const { data, error } = await supabase
      .from("ReadmeOperation")
      .insert({
        userId,
        repositoryId,
        repositoryName,
        operationType,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Failed to create readme operation",
      error
    );
  }
};

export const updateReadmeHistory = async (id, status) => {
  const { data, error } = await supabase
    .from("ReadmeOperation")
    .update({ status, updatedAt: new Date().toISOString() })
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};
