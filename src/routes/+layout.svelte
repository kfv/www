<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let gh_repo = 'https://github.com/kfv/www/';
  let gh_path = 'edit/main/src/routes';
  let page_fd = '/+page.svelte';

  onMount(() => {
    const osPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (osPrefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
  });
</script>

<nav class="border-b border-neutral-800">
  <div
    class="my-3 mx-11 sm:mx-24 md:mx-48 lg:mx-64 xl:mx-96 2xl:mx-[35rem]
                text-neutral-700/80 dark:text-neutral-400"
  >
    <a
      class="hover:text-black dark:hover:text-neutral-100 duration-500"
      href="/"
    >
      kfv
    </a>
    <a
      class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right"
      href="/about/"
    >
      about
    </a>
    <a
      class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right mr-3"
      href="/blog/"
    >
      blog
    </a>
  </div>
</nav>

<div class="main relative"><slot /></div>

<footer class="border-t border-neutral-800">
  <div
    class="text-sm text-neutral-400 my-3 mx-11 sm:mx-24 md:mx-48
                lg:mx-64 xl:mx-96 2xl:mx-[35rem]"
  >
    <p>
      &copy 2023 Faraz Vahedi, CC BY 4.0
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

<style>
  :global(body) {
    background-color: white;
    color: black;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  :global(.dark body) {
    background-color: black;
    color: white;
  }

  :global(h1) {
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  :global(h2) {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  :global(h3) {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  :global(li) {
    margin-top: 0.375rem;
    margin-bottom: 0.375rem;
  }

  :global(section) {
    margin-bottom: 1.25rem;
  }
</style>
