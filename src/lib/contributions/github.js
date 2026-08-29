import { REPOS } from './config.js';
import { FALLBACK } from './fallback.js';

function gitHubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'kfv.io',
  };

  const token =
    typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function repoId(repo) {
  return `${repo.owner}/${repo.name}`;
}

function commitHref(repo, sha) {
  if (typeof repo.commitUrl === 'function') {
    return repo.commitUrl(sha);
  }
  return `https://github.com/${repo.owner}/${repo.name}/commit/${sha}`;
}

function normalizeCommit(commit, repo) {
  const sha = commit.sha;
  const message = commit.commit?.message ?? '';

  return {
    sha,
    shortSha: sha.slice(0, 7),
    title: message.split('\n')[0] || sha,
    date: commit.commit?.author?.date ?? '',
    url: commitHref(repo, sha),
  };
}

function fallbackCommits(repo) {
  const rows = FALLBACK[repoId(repo)] ?? [];
  return rows.map(row => ({
    sha: row.sha,
    shortSha: row.sha.slice(0, 7),
    title: row.title,
    date: row.date,
    url: commitHref(repo, row.sha),
  }));
}

async function fetchRepoCommits(repo, fetchImpl) {
  const fallback = fallbackCommits(repo);
  const perPage = repo.limit ?? 12;
  const endpoint =
    `https://api.github.com/repos/${repo.owner}/${repo.name}` +
    `/commits?author=${encodeURIComponent(repo.author)}&per_page=${perPage}`;

  try {
    const res = await fetchImpl(endpoint, {
      headers: gitHubHeaders(),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return fallback;

    const payload = await res.json();
    if (!Array.isArray(payload) || payload.length === 0) return fallback;

    return payload
      .map(commit => normalizeCommit(commit, repo))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } catch {
    return fallback;
  }
}

export async function loadContributions(fetchImpl) {
  const sources = await Promise.all(
    REPOS.map(async repo => ({
      id: repoId(repo),
      label: repoId(repo),
      url: repo.url,
      commits: await fetchRepoCommits(repo, fetchImpl),
    }))
  );

  return { sources };
}
