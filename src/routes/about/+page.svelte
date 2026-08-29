<script>
  import CodeBlock from '../blog/CodeBlock.svelte';

  export let data;

  let openFingerprint = '';

  function toggleKey(fingerprint) {
    openFingerprint = openFingerprint === fingerprint ? '' : fingerprint;
  }
</script>

<svelte:head>
  <title>About — Faraz Vahedi</title>
  <meta
    name="description"
    content="Faraz Vahedi. Software engineer. Tehran."
  />
</svelte:head>

<article class="about">
  <header class="mast stage-rise">
    <h1 class="name">
      Faraz Vahedi
      <span class="handle">(kfv)</span>
    </h1>
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
  </header>

  <section class="intro stage-rise" aria-labelledby="intro-label">
    <h2 id="intro-label" class="label">intro</h2>
    <p>
      I'm a software engineer, working close to the metal, living in Tehran,
      coding, reading, studying, playing snooker, and more.
    </p>
  </section>

  {#if data.keys?.length}
    <section class="pgp stage-rise" aria-labelledby="pgp-label">
      <h2 id="pgp-label" class="label">pgp</h2>
      {#each data.keys as key (key.fingerprint)}
        <div class="pgp-item">
          <button
            class="fingerprint"
            type="button"
            aria-expanded={openFingerprint === key.fingerprint}
            aria-controls="pgp-key-{key.fingerprint}"
            on:click={() => toggleKey(key.fingerprint)}
          >
            {key.label}{#if key.revoked}<span class="pgp-note">revoked</span>{/if}
          </button>
          {#if openFingerprint === key.fingerprint}
            <div id="pgp-key-{key.fingerprint}">
              <CodeBlock code={key.armored} />
            </div>
          {/if}
        </div>
      {/each}
    </section>
  {/if}

  <section class="faq stage-rise" aria-labelledby="faq-label">
    <h2 id="faq-label" class="label">faq</h2>
    <dl>
      <div class="qa">
        <dt>School?</dt>
        <dd>
          I left. No degree. Maths, physics, computer science — I do that
          myself.
        </dd>
      </div>
      <div class="qa">
        <dt>Where?</dt>
        <dd>
          Tehran, for now. Looking to live abroad again — UK or Australia, if I
          get to choose.
        </dd>
      </div>
      <div class="qa">
        <dt>What do you read?</dt>
        <dd>
          The sciences I'm in, or political philosophy. The philosophy started
          when I was a kid and never really stopped.
        </dd>
      </div>
      <div class="qa">
        <dt>Snooker?</dt>
        <dd>
          Amateur. Practising daily to get better, to hopefully play in
          competitions in the short run.
        </dd>
      </div>
      <div class="qa">
        <dt>Languages?</dt>
        <dd>
          Persian and English. German to B2.1 once; almost none of it left.
        </dd>
      </div>
    </dl>
  </section>
</article>

<style>
  .about {
    position: relative;
    z-index: 1;
    padding: 2rem 0 0.5rem;
  }

  .mast {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.85rem 1.5rem;
    margin-bottom: 3.5rem;
  }

  .mast.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.12s;
  }

  .name {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.55rem;
    margin: 0;
    font-size: clamp(1.85rem, 4.5vw, 2.55rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: 0.04em;
  }

  .handle {
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: rgb(163 163 163);
  }

  .intro.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.28s;
  }

  .pgp.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.38s;
  }

  .faq.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.5s;
  }

  .intro {
    margin: 0;
    padding-bottom: 3rem;
  }

  .pgp {
    margin: 0;
    padding: 3rem 0;
    border-top: 1px solid rgb(64 64 64);
  }

  .faq {
    margin: 0 0 3rem;
    padding-top: 3rem;
    border-top: 1px solid rgb(64 64 64);
  }

  .label {
    margin: 0 0 1.15rem;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.04em;
    color: rgb(115 115 115);
  }

  .fingerprint {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    text-align: left;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    white-space: pre-wrap;
    color: rgb(163 163 163);
    cursor: pointer;
    transition: color 0.5s ease;
  }

  .fingerprint:hover,
  .fingerprint[aria-expanded='true'] {
    color: rgb(229 229 229);
  }

  .pgp-item + .pgp-item {
    margin-top: 0.85rem;
  }

  .pgp-note {
    margin-left: 0.7rem;
    letter-spacing: 0.06em;
    color: rgb(115 115 115);
  }

  .pgp :global(.code-block) {
    margin-top: 0.85rem;
    margin-bottom: 0;
  }

  .intro p,
  .qa dd {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.65;
    letter-spacing: 0.01em;
    color: rgb(212 212 212);
  }

  .qa a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: rgb(64 64 64);
    text-underline-offset: 0.2em;
    transition:
      color 0.5s ease,
      text-decoration-color 0.5s ease;
  }

  .qa a:hover {
    color: rgb(250 250 250);
    text-decoration-color: rgb(163 163 163);
  }

  .qa + .qa {
    margin-top: 1.65rem;
    padding-top: 1.65rem;
    border-top: 1px solid rgb(38 38 38);
  }

  .qa dt {
    margin: 0 0 0.5rem;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    color: rgb(163 163 163);
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.75rem 1.15rem;
    margin-left: auto;
    font-size: 0.8rem;
    color: rgb(163 163 163);
  }

  .contact a {
    text-decoration: none;
  }

  .contact i {
    margin-right: 0.4rem;
  }
</style>
