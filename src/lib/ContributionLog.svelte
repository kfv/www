<script>
  export let sources = [];

  function isoDate(value) {
    if (!value) return '';
    return value.slice(0, 10);
  }
</script>

{#each sources as source (source.id)}
  <figure class="log stage-rise">
    <figcaption class="log-head">
      <a
        class="repo duration-500 hover:text-black dark:hover:text-neutral-100"
        href={source.url}
      >
        {source.label}
      </a>
      <span class="author">author=kfv</span>
    </figcaption>

    {#if source.commits?.length}
      <ol class="entries">
        {#each source.commits as commit, i (commit.sha)}
          <li class="stage-rise" style="--i: {i}">
            <a
              class="entry duration-500"
              href={commit.url}
              title="{isoDate(commit.date)} — {commit.title}"
            >
              <time datetime={commit.date}>{isoDate(commit.date)}</time>
              <span class="sha">{commit.shortSha}</span>
              <span class="subject">{commit.title}</span>
            </a>
          </li>
        {/each}
      </ol>
    {:else}
      <p class="empty">no recent commits</p>
    {/if}
  </figure>
{/each}

<style>
  .log {
    margin: 0;
    border: 1px solid rgb(38 38 38);
    background: #000;
  }

  .log.stage-rise {
    animation: stage-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: 0.82s;
  }

  :global(html:not(.dark)) .log {
    border-color: rgb(229 229 229);
    background: #fff;
  }

  .log-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.7rem 0.9rem 0.65rem;
    border-bottom: 1px solid rgb(38 38 38);
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    color: rgb(163 163 163);
  }

  :global(html:not(.dark)) .log-head {
    border-bottom-color: rgb(229 229 229);
    color: rgb(115 115 115);
  }

  .repo {
    color: inherit;
    text-decoration: none;
  }

  .author {
    flex-shrink: 0;
    opacity: 0.7;
  }

  .entries {
    list-style: none;
    margin: 0;
    padding: 0.35rem 0;
  }

  .entries li {
    margin: 0;
  }

  .entries li.stage-rise {
    animation: stage-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(0.98s + var(--i, 0) * 45ms);
  }

  .entry {
    display: grid;
    grid-template-columns: 7.1rem 4.4rem minmax(0, 1fr);
    align-items: baseline;
    gap: 0.85rem;
    padding: 0.38rem 0.9rem;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.75rem;
    line-height: 1.45;
    font-variant-numeric: tabular-nums;
    text-decoration: none;
    color: inherit;
  }

  time,
  .sha {
    color: rgb(115 115 115);
  }

  :global(.dark) time,
  :global(.dark) .sha {
    color: rgb(82 82 82);
  }

  .subject {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgb(64 64 64);
  }

  :global(.dark) .subject {
    color: rgb(212 212 212);
  }

  .entry:hover {
    background: rgb(255 255 255 / 0.03);
  }

  .entry:hover time,
  .entry:hover .sha {
    color: rgb(64 64 64);
  }

  .entry:hover .subject {
    color: #000;
  }

  :global(.dark) .entry:hover time,
  :global(.dark) .entry:hover .sha {
    color: rgb(163 163 163);
  }

  :global(.dark) .entry:hover .subject {
    color: #fff;
  }

  .empty {
    margin: 0;
    padding: 0.9rem;
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.75rem;
    color: rgb(163 163 163);
  }

  @media (max-width: 639px) {
    .entry {
      grid-template-columns: 4.4rem minmax(0, 1fr);
      gap: 0.7rem;
    }

    time {
      display: none;
    }
  }
</style>
