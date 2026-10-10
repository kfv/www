<script>
  import PostList from '$lib/blog/PostList.svelte';

  export let data;
</script>

<svelte:head>
  <title>Blog — Faraz Vahedi</title>
</svelte:head>

<PostList posts={data.posts} />
