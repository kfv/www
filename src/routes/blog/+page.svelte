<script>
    function paginatedItems(items, currentPage, itemsPerPage) {
        const start = currentPage * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    }

    function totalPages(items, itemsPerPage) {
        return Math.ceil(items.length / itemsPerPage);
    }

    // List of blog posts
    const posts = [
        // ["publish date", "title", "description", "url"], ...
    ];

    let currentPage = 0;
    const postsPerPage = 5;
    const totalPageCount = totalPages(posts, postsPerPage);
    let displayedPosts;
    $: displayedPosts = paginatedItems(posts, currentPage, postsPerPage);
</script>

<div class="m-auto">
    <ul class="text-lg space-y-2.5">
        {#each displayedPosts as [date, title, description, url]}
            <li>
                <span class="md:absolute md:-left-24 mt-[4.5px] block italic
                             text-sm text-neutral-500">
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
                <button class="mt-7 px-3 py-2 border rounded hover:bg-neutral-700
                               {currentPage === index ?'bg-neutral-800' : ''}"
                        on:click={() => currentPage = index}>
                    {index + 1}
                </button>
            {/each}
        </div>
    {/if}
</div>
