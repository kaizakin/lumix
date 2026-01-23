export async function getRepoStars(owner: string, repo: string): Promise<number> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    next: { revalidate: 3600 } // Revalidate at most once per hour
  });

  if (!response.ok) return 0;
  
  const data = await response.json();
  return data.stargazers_count;
}