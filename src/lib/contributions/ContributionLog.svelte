<script>
  import './ContributionLog.css';

  export let sources = [];

  function isoDate(value) {
    if (!value) return '';
    return value.slice(0, 10);
  }
</script>

{#each sources as source (source.id)}
  <figure class="contribution-log stage-rise">
    <figcaption class="contribution-log-head">
      <a
        class="contribution-log-repo duration-500 hover:text-black dark:hover:text-neutral-100"
        href={source.url}
      >
        {source.label}
      </a>
      <span class="contribution-log-author">author=kfv</span>
    </figcaption>

    {#if source.commits?.length}
      <ol class="contribution-log-entries">
        {#each source.commits as commit, i (commit.sha)}
          <li class="stage-rise" style="--i: {i}">
            <a
              class="contribution-log-entry duration-500"
              href={commit.url}
              title="{isoDate(commit.date)} — {commit.title}"
            >
              <time datetime={commit.date}>{isoDate(commit.date)}</time>
              <span class="contribution-log-sha">{commit.shortSha}</span>
              <span class="contribution-log-subject">{commit.title}</span>
            </a>
          </li>
        {/each}
      </ol>
    {:else}
      <p class="contribution-log-empty">no recent commits</p>
    {/if}
  </figure>
{/each}
