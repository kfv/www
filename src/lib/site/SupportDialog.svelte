<script>
  import { createEventDispatcher, tick } from 'svelte';
  import SupportWallets from './SupportWallets.svelte';
  import './SupportDialog.css';

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  let dialog;
  let wallets;

  function close() {
    dispatch('close');
  }

  function handleKeydown(event) {
    if (!isOpen || event.key !== 'Escape') return;
    event.preventDefault();
    if (wallets?.collapse()) return;
    close();
  }

  $: if (isOpen) {
    tick().then(() => dialog?.focus());
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div class="support-layer stage-fade">
    <button
      type="button"
      class="support-scrim"
      tabindex="-1"
      aria-label="Close support"
      on:click={close}
    ></button>
    <div
      bind:this={dialog}
      id="support-dialog"
      class="support-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-label"
      tabindex="-1"
    >
      <div class="support-head">
        <h2 id="support-label" class="support-label">support</h2>
        <button type="button" class="support-close" on:click={close}>
          close
        </button>
      </div>

      <SupportWallets bind:this={wallets} />
    </div>
  </div>
{/if}
