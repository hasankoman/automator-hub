import supabase from "../utils/supabase.js";
import { createApiError, ErrorTypes } from "../utils/errorHandler";
import { encrypt } from "../utils/encryption";

export const getByGithubId = async (githubId) => {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("githubId", String(githubId))
    .single();

  if (error) return null;
  return data;
};

export const getById = async (id) => {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
};

export const createOrUpdateFromGithub = async (profile, accessToken) => {
  const encryptedAccessToken = encrypt(accessToken);
  const existingUser = await getByGithubId(profile.id);

  if (existingUser) {
    const { data, error } = await supabase
      .from("User")
      .update({
        email: profile.email,
        name: profile.name,
        githubUsername: profile.login,
        githubToken: encryptedAccessToken,
        updatedAt: new Date().toISOString(),
      })
      .eq("githubId", String(profile.id))
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("User")
      .insert({
        email: profile.email,
        name: profile.name,
        githubId: String(profile.id),
        githubUsername: profile.login,
        githubToken: encryptedAccessToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const deleteUser = async (id) => {
  try {
    const { data: user, error: userError } = await supabase
      .from("User")
      .select(
        `
        *,
        usage:Usage(*),
        subscription:Subscription(*),
        monitoredRepos:MonitoredRepository(*),
        readmeOperations:ReadmeOperation(*),
        subscriptionHistory:SubscriptionHistory(*)
      `
      )
      .eq("id", id)
      .single();

    if (userError || !user) {
      throw createApiError(ErrorTypes.NOT_FOUND, "User not found");
    }

    // Supabase doesn't support transactions the same way Prisma does
    // so we'll delete related data first, then the user

    // Delete usage
    if (user.usage) {
      await supabase.from("Usage").delete().eq("userId", id);
    }

    // Delete subscription
    if (user.subscription) {
      await supabase.from("Subscription").delete().eq("userId", id);
    }

    // Delete monitored repositories
    if (user.monitoredRepos && user.monitoredRepos.length > 0) {
      await supabase.from("MonitoredRepository").delete().eq("userId", id);
    }

    // Delete readme operations
    if (user.readmeOperations && user.readmeOperations.length > 0) {
      await supabase.from("ReadmeOperation").delete().eq("userId", id);
    }

    // Delete subscription history
    if (user.subscriptionHistory && user.subscriptionHistory.length > 0) {
      await supabase.from("SubscriptionHistory").delete().eq("userId", id);
    }

    // Finally delete the user
    const { error: deleteUserError } = await supabase
      .from("User")
      .delete()
      .eq("id", id);

    if (deleteUserError) throw deleteUserError;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error deleting user account",
      error
    );
  }
};

export const createOrGetFromGithub = async (profile, accessToken) => {
  const encryptedAccessToken = encrypt(accessToken);
  const existingUser = await getByGithubId(profile.id);

  if (existingUser) {
    const { data, error } = await supabase
      .from("User")
      .update({ githubToken: encryptedAccessToken })
      .eq("id", existingUser.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("User")
    .insert({
      email: profile.email,
      name: profile.name,
      githubId: String(profile.id),
      githubUsername: profile.login,
      githubToken: encryptedAccessToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
