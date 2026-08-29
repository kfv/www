<script>
  import CodeBlock from '$lib/ui/CodeBlock.svelte';
  import './PgpKeys.css';

  export let keys = [];

  let openFingerprint = '';

  function toggleKey(fingerprint) {
    openFingerprint = openFingerprint === fingerprint ? '' : fingerprint;
  }
</script>

<div class="pgp-keys">
  {#each keys as key (key.fingerprint)}
    <div class="pgp-keys-item">
      <button
        class="pgp-keys-fingerprint"
        type="button"
        aria-expanded={openFingerprint === key.fingerprint}
        aria-controls="pgp-key-{key.fingerprint}"
        on:click={() => toggleKey(key.fingerprint)}
      >
        {key.label}
        {#if key.revoked}
          <span class="pgp-keys-note">revoked</span>
        {/if}
      </button>
      {#if openFingerprint === key.fingerprint}
        <div id="pgp-key-{key.fingerprint}">
          <CodeBlock code={key.armored} />
        </div>
      {/if}
    </div>
  {/each}
</div>
