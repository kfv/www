<script module>
  export { default as CodeBlock } from '$lib/ui/CodeBlock.svelte';
</script>

<script>
  import TOC from '$lib/blog/TOC.svelte';
  import './Post.css';

  export let title = '';
  export let sections = [];
</script>

<svelte:head>
  <title>{title} — Faraz Vahedi</title>
</svelte:head>

<article>
  <h1>{title}</h1>

  <TOC {sections} />

  <div class="post-body">
    <slot />
  </div>
</article>
