<script>
  import { onMount } from 'svelte';
  import GaussianWell from './GaussianWell.svelte';
  import SiteNav from './SiteNav.svelte';
  import SiteFooter from './SiteFooter.svelte';
  import DonateModal from './DonateModal.svelte';

  let donateOpen = false;

  onMount(() => {
    document.documentElement.classList.add('dark');
  });
</script>

<GaussianWell />
<SiteNav {donateOpen} on:donate={() => (donateOpen = true)} />
<div class="main relative z-10"><slot /></div>
<DonateModal isOpen={donateOpen} on:close={() => (donateOpen = false)} />
<SiteFooter />
