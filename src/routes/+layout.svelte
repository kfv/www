<script>
    import "../app.css";
    import { page } from "$app/stores";

    let gh_repo = "https://github.com/kfv/www/";
    let gh_path = "edit/main/src/routes";
    let page_fd = "/+page.svelte";
</script>

<nav class="border-b border-neutral-800">
    <div class="my-3 mx-11 sm:mx-24 md:mx-48 lg:mx-64 xl:mx-96 2xl:mx-[35rem]
                text-neutral-700/80 dark:text-neutral-400">
        <a class="hover:text-black dark:hover:text-neutral-100 duration-500"
           href="/">
            kfv
        </a>
        <a class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right"
           href="/about/">
            about
        </a>
        <a class="hover:text-black dark:hover:text-neutral-100 duration-500
                  float-right mr-3"
           href="/blog/">
            blog
        </a>
    </div>
</nav>

<div class="main relative"><slot /></div>

<footer class="border-t border-neutral-800">
    <div class="text-sm text-neutral-400 my-3 mx-11 sm:mx-24 md:mx-48
                lg:mx-64 xl:mx-96 2xl:mx-[35rem]">
        <p>
            &copy 2023 Faraz Vahedi, CC BY 4.0
            <a href="{gh_repo}{gh_path}{$page.url.pathname}{page_fd}"
               class="hover:text-black dark:hover:text-neutral-100
                               duration-500 float-right">
                edit
                <i class="ml-2 fa-brands fa-github"></i>
            </a>
        </p>
    </div>
</footer>

<style lang="postcss">
    :global(body) {
        @apply bg-white dark:bg-black dark:text-white flex flex-col h-screen;
    }
    :global(h1) { @apply text-3xl my-3; }
    :global(h2) { @apply text-2xl my-2; }
    :global(h3) { @apply text-xl; }
    :global(li) { @apply my-1.5; }
    :global(section) { @apply mb-5; }
</style>
