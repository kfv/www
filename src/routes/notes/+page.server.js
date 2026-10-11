import { loadNotes } from '$lib/notes/bluesky.js';

export async function load({ fetch }) {
  return { feed: await loadNotes(fetch) };
}
