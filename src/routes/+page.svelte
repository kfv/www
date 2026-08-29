<script>
  import Home from '$lib/home/Home.svelte';

  export let data;
</script>

<svelte:head>
  <title>kfv</title>
  <meta name="color-scheme" content="dark" />
  <meta
    name="description"
    content="Operating systems, compilers, and financial systems. FreeBSD src committer."
  />
</svelte:head>

<Home sources={data.sources} />
