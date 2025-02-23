export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const headers = {
      Authorization: `Bearer ${session.user.github.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    const repos = await fetchRepos(headers);
    const repoData = await enrichReposWithLanguages(repos, headers);

    return createApiResponse(repoData);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});

async function fetchRepos(headers) {
  const res = await fetch(
    "https://api.github.com/user/repos?affiliation=owner&sort=updated",
    { headers }
  );

  if (!res.ok) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `GitHub API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

async function enrichReposWithLanguages(repos, headers) {
  const enrichedRepos = await Promise.all(
    repos.map(async (repo) => {
      try {
        const [languages, webhooks] = await Promise.all([
          fetchLanguages(repo.languages_url, headers),
          fetchWebhooks(
            `https://api.github.com/repos/${repo.full_name}/hooks`,
            headers
          ),
        ]);

        const webhook = webhooks.find(
          (hook) =>
            hook.config.url ===
            `${useRuntimeConfig().public.appUrl}/api/github-webhooks/receive`
        );

        return {
          ...repo,
          id: String(repo.id),
          fullName: repo.full_name,
          url: repo.html_url,
          description: repo.description,
          avatarUrl: repo.owner.avatar_url,
          language: repo.language,
          stars: repo.stargazers_count,
          defaultBranch: repo.default_branch,
          languages,
          webhook: webhook
            ? {
                active: webhook.active,
              }
            : null,
        };
      } catch (err) {
        console.error(
          `Repository information for ${repo.name} could not be retrieved:`,
          err
        );
        return null;
      }
    })
  );

  return enrichedRepos.filter(Boolean);
}

async function fetchLanguages(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Language information could not be retrieved: ${res.status} ${res.statusText}`
    );
  }
  return res.json();
}

async function fetchWebhooks(url, headers) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(
        `Webhook information could not be retrieved: ${res.status} ${res.statusText}`
      );
      return [];
    }
    return res.json();
  } catch (error) {
    console.warn("Error fetching webhooks:", error);
    return [];
  }
}
