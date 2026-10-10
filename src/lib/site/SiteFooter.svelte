<script>
  import { page } from '$app/stores';
  import { shell } from './shell.js';

  const gh_repo = 'https://github.com/kfv/www/';
  const gh_path = 'edit/main/src/routes';

  // Blog posts are Markdown (mdsvex); everything else is Svelte.
  $: page_fd = /^\/blog\/[^/]+$/.test($page.route.id ?? '')
    ? '/+page.svx'
    : '/+page.svelte';
</script>

<footer class="relative z-10 border-t border-neutral-800">
  <div class="text-sm text-neutral-400 {shell}">
    <p>
      &copy 2019-2026 Faraz Vahedi, CC BY 4.0
      <a
        href="{gh_repo}{gh_path}{$page.url.pathname}{page_fd}"
        class="hover:text-black dark:hover:text-neutral-100
                               duration-500 float-right"
      >
        edit
        <i class="ml-2 fa-brands fa-github"></i>
      </a>
    </p>
  </div>
</footer>
