import { loadContributions } from '$lib/contributions/github.js';

export async function load({ fetch }) {
  return loadContributions(fetch);
}
