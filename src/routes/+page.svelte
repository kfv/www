<script>
  import ContributionLog from '$lib/ContributionLog.svelte';

  export let data;

  const fields = [
    { basis: '1', name: 'operating systems' },
    { basis: '2', name: 'compilers' },
    { basis: '3', name: 'financial systems' },
  ];
</script>

<svelte:head>
  <title>kfv</title>
  <meta name="color-scheme" content="dark" />
  <meta
    name="description"
    content="Operating systems, compilers, and financial systems. FreeBSD src committer."
  />
</svelte:head>

<article class="stage">
  <header class="mast">
    <svg
      class="axes"
      viewBox="0 0 48 48"
      width="40"
      height="40"
      fill="none"
      aria-hidden="true"
    >
      <path class="stage-draw e3" pathLength="1" d="M24 24 V8" />
      <path class="stage-draw e2" pathLength="1" d="M24 24 L40 32" />
      <path class="stage-draw e1" pathLength="1" d="M24 24 L8 34" />
      <circle class="stage-fade origin" cx="24" cy="24" r="1.2" fill="currentColor" />
    </svg>

    <h1 class="wordmark stage-rise">kfv</h1>
    <p class="product stage-rise">
      <span class="factor e1">os</span>
      ×
      <span class="factor e2">compilers</span>
      ×
      <span class="factor e3">finance</span>
    </p>
  </header>

  <section class="fields" aria-label="fields of work">
    {#each fields as field, i (field.name)}
      <div class="field stage-rise" data-axis={field.basis} style="--i: {i}">
        <p class="field-name">
          <span class="basis">e<sub>{field.basis}</sub></span>
          {field.name}
        </p>
      </div>
    {/each}
  </section>

  <ContributionLog sources={data.sources} />

  <footer class="colophon stage-rise">
    <nav class="contact" aria-label="contact">
      <a
        class="duration-500 hover:text-black dark:hover:text-neutral-100"
        href="https://github.com/kfv"
      >
        <i class="fa-brands fa-github"></i>
        kfv
      </a>
      <a
        class="duration-500 hover:text-black dark:hover:text-neutral-100"
        href="https://www.linkedin.com/in/kfv"
      >
        <i class="fa-brands fa-linkedin-in"></i>
        kfv
      </a>
      <a
        class="duration-500 hover:text-black dark:hover:text-neutral-100"
        href="mailto:kfv@FreeBSD.org"
      >
        <i class="fa-solid fa-envelope"></i>
        kfv@FreeBSD.org
      </a>
    </nav>
  </footer>
</article>

<style>
  .stage {
    position: relative;
    z-index: 1;
    padding: 2rem 0 0.5rem;
  }

  .mast {
    margin-bottom: 3.5rem;
  }

  .axes {
    display: block;
    margin-bottom: 1.15rem;
    color: rgb(82 82 82);
    stroke: currentColor;
    stroke-width: 1;
    stroke-linecap: round;
  }

  .axes path.stage-draw {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: stage-draw 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    transition:
      stroke 0.5s ease,
      opacity 0.5s ease;
  }

  .axes path.stage-draw:nth-of-type(2) {
    animation-delay: 80ms;
  }

  .axes path.stage-draw:nth-of-type(3) {
    animation-delay: 160ms;
  }

  .axes circle.stage-fade {
    animation: stage-fade 0.4s ease both;
    animation-delay: 0.42s;
    transition:
      color 0.5s ease,
      opacity 0.5s ease;
  }

  .wordmark {
    margin: 0;
    font-size: clamp(2.35rem, 6vw, 3.15rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: 0.04em;
  }

  .wordmark.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.38s;
  }

  .product {
    margin: 0.85rem 0 0;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: rgb(115 115 115);
  }

  .product.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.5s;
  }

  .factor {
    transition:
      color 0.5s ease,
      opacity 0.5s ease;
  }

  :global(.dark) .product {
    color: rgb(163 163 163);
  }

  .fields {
    display: grid;
    gap: 1.75rem;
    margin: 0 0 3.25rem;
  }

  .field.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(0.62s + var(--i, 0) * 80ms);
  }

  @media (hover: hover) and (pointer: fine) {
    .field {
      transition: opacity 0.5s ease;
    }

    .stage:has(.field:hover) .field {
      opacity: 0.5;
    }

    .stage:has(.field[data-axis='1']:hover) .field[data-axis='1'],
    .stage:has(.field[data-axis='2']:hover) .field[data-axis='2'],
    .stage:has(.field[data-axis='3']:hover) .field[data-axis='3'] {
      opacity: 1;
    }

    .stage:has(.field:hover) .axes path {
      opacity: 0.28;
    }

    .stage:has(.field:hover) .factor {
      opacity: 0.35;
    }

    .stage:has(.field[data-axis='1']:hover) .axes path.e1,
    .stage:has(.field[data-axis='2']:hover) .axes path.e2,
    .stage:has(.field[data-axis='3']:hover) .axes path.e3 {
      opacity: 1;
      stroke: rgb(229 229 229);
    }

    .stage:has(.field:hover) .axes .origin {
      color: rgb(229 229 229);
    }

    .stage:has(.field[data-axis='1']:hover) .factor.e1,
    .stage:has(.field[data-axis='2']:hover) .factor.e2,
    .stage:has(.field[data-axis='3']:hover) .factor.e3 {
      opacity: 1;
      color: rgb(229 229 229);
    }
  }

  .field-name {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.45;
    letter-spacing: 0.02em;
    text-transform: lowercase;
    color: rgb(38 38 38);
  }

  :global(.dark) .field-name {
    color: rgb(229 229 229);
  }

  .basis {
    display: inline-block;
    min-width: 1.55rem;
    margin-right: 0.35rem;
    letter-spacing: 0.02em;
    color: rgb(163 163 163);
  }

  .basis sub {
    font-size: 0.72em;
    font-variant-position: sub;
  }

  :global(.dark) .basis {
    color: rgb(82 82 82);
  }

  .colophon {
    margin-top: 3rem;
  }

  .colophon.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 1.25s;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.35rem;
    font-size: 0.9rem;
    color: rgb(82 82 82 / 0.85);
  }

  :global(.dark) .contact {
    color: rgb(163 163 163);
  }

  .contact a {
    text-decoration: none;
  }

  .contact i {
    margin-right: 0.4rem;
  }

  @media (min-width: 640px) {
    .fields {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0;
    }

    .field {
      padding-right: 1.25rem;
    }

    .field + .field {
      padding-left: 1.35rem;
      padding-right: 0;
      border-left: 1px solid rgb(229 229 229);
    }

    :global(.dark) .field + .field {
      border-left-color: rgb(38 38 38);
    }
  }
</style>
