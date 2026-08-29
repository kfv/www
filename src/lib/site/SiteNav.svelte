<script>
  import { createEventDispatcher } from 'svelte';
  import { shell } from './shell.js';
  import './SiteNav.css';

  export let supportOpen = false;

  const dispatch = createEventDispatcher();
</script>

<nav class="site-nav">
  <div class="site-nav-inner {shell}">
    <a href="/">kfv</a>
    <div class="site-nav-links">
      <a href="/blog/">blog</a>
      <a href="/about/">about</a>
      <button
        type="button"
        class="site-nav-support"
        aria-expanded={supportOpen}
        aria-haspopup="dialog"
        aria-controls="support-dialog"
        on:click={() => dispatch('support')}
      >
        support
      </button>
    </div>
  </div>
</nav>
