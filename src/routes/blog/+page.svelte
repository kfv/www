<script>
  function paginatedItems(items, currentPage, itemsPerPage) {
    const start = currentPage * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }

  function totalPages(items, itemsPerPage) {
    return Math.ceil(items.length / itemsPerPage);
  }

  const posts = [
    // ["publish date", "title", "description", "url"], ...
    [
      'Sept 2023',
      'Machine Mirage in a Silicon Whisper; "Hello, world!"',
      'Delve deep into the underpinnings of the iconic "Hello, world!"—unveiling the art and science behind every instruction and exploring what it truly means to speak to a machine. A blend of tradition and trickery ballet.',
      '/blog/hello-world',
    ],
  ];

  let currentPage = 0;
  const postsPerPage = 5;
  const totalPageCount = totalPages(posts, postsPerPage);
  let displayedPosts;
  $: displayedPosts = paginatedItems(posts, currentPage, postsPerPage);
</script>

<svelte:head>
  <title>Blog — Faraz Vahedi</title>
</svelte:head>

<div class="m-auto">
  <ul class="text-lg space-y-2.5">
    {#each displayedPosts as [date, title, description, url]}
      <li>
        <span
          class="md:absolute md:-left-24 mt-[4.5px] block italic
                             text-sm text-neutral-500"
        >
          {date}
        </span>
        <a href={url}>
          {title}
        </a>
        <p class="mt-2 mb-4 text-neutral-400 text-base">
          {description}
        </p>
      </li>
    {/each}
  </ul>
  {#if totalPageCount > 1}
    <div class="flex justify-center space-x-4 mt-4">
      {#each Array(totalPageCount) as _, index (index)}
        <button
          class="mt-7 px-3 py-2 border rounded
                               dark:hover:bg-neutral-700 hover:bg-neutral-600
                               hover:text-neutral-100
                               {currentPage === index
            ? 'bg-neutral-800 text-neutral-100'
            : ''}"
          on:click={() => (currentPage = index)}
        >
          {index + 1}
        </button>
      {/each}
    </div>
  {/if}
</div>
