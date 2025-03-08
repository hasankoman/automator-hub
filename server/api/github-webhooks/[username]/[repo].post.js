import supabase from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const { isActive } = await readBody(event);
    const { username, repo } = event.context.params;

    const { data: repository, error: repoError } = await supabase
      .from("MonitoredRepository")
      .select("webhookId, id")
      .eq("userId", session.user.id)
      .eq("fullName", `${username}/${repo}`)
      .single();

    if (repoError) throw repoError;

    if (repository?.webhookId) {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/hooks/${repository.webhookId}`,
        {
          method: "PATCH",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${session.user.github.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({ active: isActive }),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const { error: updateError } = await supabase
        .from("MonitoredRepository")
        .update({ isActive: isActive })
        .eq("id", repository.id);

      if (updateError) throw updateError;
    } else {
      throw new Error("Webhook not found");
    }

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to deactivate webhook: ${error.message}`,
      error
    );
  }
});
