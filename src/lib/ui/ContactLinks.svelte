<script>
  import { contact } from '$lib/contact.js';
  import './ContactLinks.css';

  export let compact = false;
</script>

<nav class="contact-links" class:compact aria-label="contact">
  {#each contact as item (item.href)}
    <a
      class="duration-500 hover:text-black dark:hover:text-neutral-100"
      href={item.href}
    >
      <i class={item.icon}></i>
      {item.label}
    </a>
  {/each}
</nav>
