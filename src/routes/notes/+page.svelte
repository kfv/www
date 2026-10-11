<script>
  import Notes from '$lib/notes/Notes.svelte';

  export let data;
</script>

<svelte:head>
  <title>Notes — Faraz Vahedi</title>
  <meta name="description" content="Short posts and threads from Bluesky." />
</svelte:head>

<Notes feed={data.feed} />
