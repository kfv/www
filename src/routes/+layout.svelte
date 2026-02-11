<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import DonateModal from '$lib/DonateModal.svelte';

  let gh_repo = 'https://github.com/kfv/www/';
  let gh_path = 'edit/main/src/routes';
  let page_fd = '/+page.svelte';
  let isDonateModalOpen = false;
  let heartElement;
  let isHovering = false;

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

  function openDonateModal() {
    isDonateModalOpen = true;
  }

  function closeDonateModal() {
    isDonateModalOpen = false;
  }

  function handleHeartMouseEnter() {
    isHovering = true;

    const checkColor = () => {
      if (!isHovering || !heartElement) return;

      const computedStyle = getComputedStyle(heartElement);
      const strokeColor = computedStyle.stroke;

      if (strokeColor === 'rgb(244, 114, 182)' || strokeColor === '#f472b6') {
        heartElement.style.animationPlayState = 'paused';
      } else {
        requestAnimationFrame(checkColor);
      }
    };

    checkColor();
  }

  function handleHeartMouseLeave() {
    isHovering = false;
    if (heartElement) {
      heartElement.style.animationPlayState = 'running';
    }
  }
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
    <button
      on:click={openDonateModal}
      class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right relative cursor-pointer group"
      title="Support my work"
      aria-label="Support my work"
    >
      <svg
        bind:this={heartElement}
        on:mouseenter={handleHeartMouseEnter}
        on:mouseleave={handleHeartMouseLeave}
        class="w-5 h-5 heart-pulse {isDonateModalOpen
          ? 'animate-none stroke-pink-400'
          : ''}"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label="heart"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        />
      </svg>
    </button>
    <a
      class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right mr-3"
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

<DonateModal isOpen={isDonateModalOpen} on:close={closeDonateModal} />

<footer class="border-t border-neutral-800">
  <div
    class="text-sm text-neutral-400 my-3 mx-11 sm:mx-24 md:mx-48
                lg:mx-64 xl:mx-96 2xl:mx-[35rem]"
  >
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

  .heart-pulse {
    animation: pulse 1.7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      stroke: #d5d5d5;
    }
    50% {
      stroke: #f472b6;
    }
  }
</style>
