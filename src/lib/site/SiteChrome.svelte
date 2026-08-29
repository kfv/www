<script>
  import { onMount } from 'svelte';
  import GaussianWell from './GaussianWell.svelte';
  import SiteNav from './SiteNav.svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SupportDialog from './SupportDialog.svelte';

  let supportOpen = false;

  onMount(() => {
    document.documentElement.classList.add('dark');
  });
</script>

<GaussianWell />
<SiteNav {supportOpen} on:support={() => (supportOpen = true)} />
<div class="main relative z-10"><slot /></div>
<SupportDialog isOpen={supportOpen} on:close={() => (supportOpen = false)} />
<SiteFooter />
