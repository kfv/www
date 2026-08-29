<script>
  import { faq } from './faq.js';
  import './Faq.css';
</script>

<dl>
  {#each faq as item (item.q)}
    <div class="faq-item">
      <dt>{item.q}</dt>
      <dd>{item.a}</dd>
    </div>
  {/each}
</dl>
