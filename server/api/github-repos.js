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
        const languages = await fetchLanguages(repo.languages_url, headers);
        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          languages,
          url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
        };
      } catch (err) {
        console.error(
          `Language information for ${repo.name} could not be retrieved:`,
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
