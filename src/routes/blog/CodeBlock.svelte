<script>
  import { fade } from 'svelte/transition';
  export let code = '';
  let copied = false;

  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(err => {
        console.error('Could not copy text: ', err);
      });
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  }
</script>

<div class="code-block">
  <button
    class="absolute top-0 right-0 m-2 px-2 py-1 text-xs rounded
                   hover:bg-neutral-700 hover:text-white"
    on:click={copyToClipboard}
  >
    {#if !copied}
      <i in:fade={{ duration: 500 }} class="fa-regular fa-copy"></i>
    {/if}
    {#if copied}
      <span in:fade={{ duration: 500 }}>
        Copied <i class="ml-1 fa-regular fa-check"></i>
      </span>
    {/if}
  </button>
  <div class="overflow-x-auto">
    <pre><code>{code}</code></pre>
  </div>
</div>

<style>
  .code-block {
    border: 1px solid #52525b;
    border-radius: 0.25rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    padding: 1.25rem;
    position: relative;
  }
  .code-block code {
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono',
      Menlo, monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
</style>
