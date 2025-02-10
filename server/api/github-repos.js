import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.github?.accessToken) {
    return { error: { message: "Unauthorized", statusCode: 401 } };
  }

  const apiUrl = "https://api.github.com/user/repos?affiliation=owner";
  const headers = {
    Authorization: `Bearer ${session?.user?.github?.accessToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const res = await fetch(apiUrl, { headers });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `GitHub API error: ${res.status} ${res.statusText} - ${errorText}`
      );
    }

    const repos = await res.json();

    const repoData = await Promise.all(
      repos.map(async (repo) => {
        try {
          const langRes = await fetch(repo.languages_url, { headers });

          if (!langRes.ok) {
            console.error(`Failed to fetch languages for ${repo.name}`);
            return null;
          }

          const languages = await langRes.json();
          return {
            name: repo.name,
            id: String(repo.id),
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            avatarUrl: repo.owner.avatar_url,
            language: repo.language,
            stars: repo.stargazers_count,
            defaultBranch: repo.default_branch,
            languages,
          };
        } catch (err) {
          console.error(`Error fetching languages for ${repo.name}:`, err);
          return null;
        }
      })
    );

    return { data: repoData.filter(Boolean) }; // Hata alanları filtrele
  } catch (error) {
    return {
      error: {
        message: error.message || "Internal Server Error",
        statusCode: 500,
      },
    };
  }
});
