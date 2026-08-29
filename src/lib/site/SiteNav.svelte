<script>
  import { createEventDispatcher } from 'svelte';
  import { shell } from './shell.js';
  import './SiteNav.css';

  export let donateOpen = false;

  const dispatch = createEventDispatcher();

  let heartElement;
  let isHovering = false;

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

<nav class="relative z-10 border-b border-neutral-800">
  <div class="{shell} text-neutral-700/80 dark:text-neutral-400">
    <a
      class="hover:text-black dark:hover:text-neutral-100 duration-500"
      href="/"
    >
      kfv
    </a>
    <button
      on:click={() => dispatch('donate')}
      class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right relative cursor-pointer group"
      title="Support my work"
      aria-label="Support my work"
    >
      <svg
        bind:this={heartElement}
        on:mouseenter={handleHeartMouseEnter}
        on:mouseleave={handleHeartMouseLeave}
        class="w-5 h-5 heart-pulse {donateOpen
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
