import { decrementMetric } from "~/server/db/usage";
import supabase from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const { username, repo } = event.context.params;

    const { data: repository, error: repoError } = await supabase
      .from("MonitoredRepository")
      .select("webhookId")
      .eq("userId", session.user.id)
      .eq("fullName", `${username}/${repo}`)
      .single();

    if (repoError) throw repoError;

    if (repository?.webhookId) {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/hooks/${repository.webhookId}`,
        {
          method: "DELETE",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${session.user.github.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
    }

    const { error: deleteError } = await supabase
      .from("MonitoredRepository")
      .delete()
      .eq("userId", session.user.id)
      .eq("fullName", `${username}/${repo}`);

    if (deleteError) throw deleteError;

    await decrementMetric(session.user.id, "autoReadmeUsed");

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to remove webhook: ${error.message}`,
      error
    );
  }
});
