<script>
  import { fields } from './fields.js';
  import './Fields.css';
</script>

<section class="home-fields" aria-label="fields of work">
  {#each fields as field, i (field.name)}
    <div class="home-field stage-rise" data-axis={field.basis} style="--i: {i}">
      <p class="home-field-name">
        <span class="home-basis">e<sub>{field.basis}</sub></span>
        {field.name}
      </p>
    </div>
  {/each}
</section>
