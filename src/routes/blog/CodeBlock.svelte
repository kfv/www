<script>
    import { fade } from 'svelte/transition';
    export let code = '';
    let copied = false;

    function copyToClipboard() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).catch(err => {
                console.error('Could not copy text: ', err);
            });
            copied = true
            setTimeout(() => {
                copied = false;
            }, 2000);
        }
    }
</script>

<div class="code-block">
    <button class="absolute top-0 right-0 m-2 px-2 py-1 text-xs rounded
                   hover:bg-neutral-700 hover:text-white"
            on:click={copyToClipboard}>
        {#if !copied}
            <i in:fade={{duration: 500}} class="fa-regular fa-copy"></i>
        {/if}
        {#if copied}
            <span in:fade={{duration: 500}}>
                Copied <i class="ml-1 fa-regular fa-check"></i>
            </span>
        {/if}
    </button>
    <div class="overflow-x-auto">
        <pre><code>{code}</code></pre>
    </div>
</div>

<style lang="postcss">
    .code-block {
        @apply border border-neutral-600 rounded my-5 p-5 relative;
    }
    .code-block code {
        @apply font-mono text-sm;
    }
</style>
