<script>
  import './StageSection.css';

  export let id;
  export let label;
  export let delay = '0s';
</script>

<section
  class="stage-section stage-rise"
  style="--stage-delay: {delay}"
  aria-labelledby="{id}-label"
>
  <h2 id="{id}-label" class="stage-label">{label}</h2>
  <slot />
</section>
