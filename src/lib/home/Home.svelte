<script>
  import Mast from './Mast.svelte';
  import Fields from './Fields.svelte';
  import ContributionLog from '$lib/contributions/ContributionLog.svelte';
  import ContactLinks from '$lib/ui/ContactLinks.svelte';
  import './Home.css';

  export let sources = [];
</script>

<article class="page home">
  <Mast />
  <Fields />
  <ContributionLog {sources} />
  <footer class="home-colophon stage-rise">
    <ContactLinks />
  </footer>
</article>
