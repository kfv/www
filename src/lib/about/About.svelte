<script>
  import Mast from './Mast.svelte';
  import PgpKeys from './PgpKeys.svelte';
  import Faq from './Faq.svelte';
  import StageSection from '$lib/ui/StageSection.svelte';

  export let keys = [];
</script>

<article class="page">
  <Mast />

  <StageSection id="intro" label="intro" delay="0.28s">
    <p>
      I'm a software engineer, working close to the metal, living in Tehran,
      coding, reading, studying, playing snooker, and more.
    </p>
  </StageSection>

  {#if keys?.length}
    <StageSection id="pgp" label="pgp" delay="0.38s">
      <PgpKeys {keys} />
    </StageSection>
  {/if}

  <StageSection id="faq" label="faq" delay="0.5s">
    <Faq />
  </StageSection>
</article>
