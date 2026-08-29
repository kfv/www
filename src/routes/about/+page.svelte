<script>
  import About from '$lib/about/About.svelte';

  export let data;
</script>

<svelte:head>
  <title>About — Faraz Vahedi</title>
  <meta name="description" content="Faraz Vahedi. Software engineer. Tehran." />
</svelte:head>

<About keys={data.keys} />
