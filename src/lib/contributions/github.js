import { browser } from '$app/environment';
import { REPOS } from './config.js';
import { FALLBACK } from './fallback.js';

const SHA = /^[0-9a-f]{40}$/;

function gitHubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
  };

  if (browser) return headers;

  headers['X-GitHub-Api-Version'] = '2022-11-28';
  headers['User-Agent'] = 'kfv.io';

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
  const sha = commit?.sha;
  if (typeof sha !== 'string' || !SHA.test(sha)) return null;

  const message = commit.commit?.message ?? '';

  return {
    sha,
    shortSha: sha.slice(0, 7),
    title: message.split('\n')[0] || sha,
    date: commit.commit?.author?.date ?? '',
    url: commitHref(repo, sha),
  };
}

function byDate(a, b) {
  return (b.date || '').localeCompare(a.date || '');
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

async function fetchCommitPage(repo, page, fetchImpl) {
  const perPage = repo.limit ?? 12;
  const endpoint =
    `https://api.github.com/repos/${repo.owner}/${repo.name}` +
    `/commits?author=${encodeURIComponent(repo.author)}` +
    `&per_page=${perPage}&page=${page}`;

  const res = await fetchImpl(endpoint, {
    headers: gitHubHeaders(),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const err = new Error(`GitHub API ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const payload = await res.json();
  if (!Array.isArray(payload)) throw new Error('unexpected GitHub response');

  return {
    commits: payload
      .map(commit => normalizeCommit(commit, repo))
      .filter(Boolean)
      .sort(byDate),
    more: payload.length === perPage,
  };
}

async function loadRepo(repo, fetchImpl) {
  try {
    const { commits, more } = await fetchCommitPage(repo, 1, fetchImpl);
    if (commits.length) return { commits, page: 1, more };
  } catch {
    // fall through
  }
  return { commits: fallbackCommits(repo), page: 0, more: true };
}

export async function loadContributions(fetchImpl) {
  const sources = await Promise.all(
    REPOS.map(async repo => ({
      id: repoId(repo),
      label: repoId(repo),
      url: repo.url,
      logUrl: repo.logUrl,
      ...(await loadRepo(repo, fetchImpl)),
    }))
  );

  return { sources };
}

export async function loadOlderCommits(source, fetchImpl) {
  const repo = REPOS.find(r => repoId(r) === source.id);
  if (!repo) throw new Error(`unknown source ${source.id}`);

  const page = source.page + 1;
  const { commits, more } = await fetchCommitPage(repo, page, fetchImpl);
  const seen = new Set(source.commits.map(c => c.sha));

  return {
    ...source,
    commits: source.commits
      .concat(commits.filter(c => !seen.has(c.sha)))
      .sort(byDate),
    page,
    more,
  };
}
