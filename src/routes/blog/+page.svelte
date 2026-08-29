<script>
  import PostList from '$lib/blog/PostList.svelte';
  import { posts } from '$lib/blog/posts.js';
</script>

<svelte:head>
  <title>Blog — Faraz Vahedi</title>
</svelte:head>

<PostList {posts} />
