import { loadPublicKeys } from '$lib/pgp.js';

export async function load() {
  return { keys: await loadPublicKeys() };
}
