import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { URL, fileURLToPath } from 'node:url';
import { mdsvex } from 'mdsvex';
import { highlighter, sections } from './src/lib/blog/markdown.js';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({
      fallback: '404.html',
    }),
  },
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      layout: fileURLToPath(
        new URL('./src/lib/blog/Post.svelte', import.meta.url)
      ),
      remarkPlugins: [sections],
      highlight: { highlighter },
      smartypants: false,
    }),
  ],
};

export default config;
