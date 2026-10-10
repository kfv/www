<script>
  import { loadOlderCommits } from './github.js';
  import './ContributionLog.css';

  export let sources = [];

  const initial = new Set(sources.flatMap(s => s.commits.map(c => c.sha)));

  let busy = {};
  let errors = {};

  function isoDate(value) {
    if (!value) return '';
    return value.slice(0, 10);
  }

  async function older(source) {
    busy = { ...busy, [source.id]: true };
    errors = { ...errors, [source.id]: '' };

    try {
      const next = await loadOlderCommits(source, fetch);
      sources = sources.map(s => (s.id === source.id ? next : s));
    } catch (err) {
      const limited = err?.status === 403 || err?.status === 429;
      errors = {
        ...errors,
        [source.id]: limited ? 'rate limited, try later' : 'could not load',
      };
    } finally {
      busy = { ...busy, [source.id]: false };
    }
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
          <li
            class="stage-rise"
            class:contribution-log-loaded={!initial.has(commit.sha)}
            style="--i: {i}"
          >
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

    <div class="contribution-log-foot">
      {#if source.more}
        <button
          class="contribution-log-more"
          type="button"
          disabled={busy[source.id]}
          on:click={() => older(source)}
        >
          {busy[source.id] ? 'loading…' : 'older'}
        </button>
      {/if}
      <span class="contribution-log-status" role="status">
        {errors[source.id] ?? ''}
      </span>
      {#if source.logUrl}
        <a class="contribution-log-full duration-500" href={source.logUrl}>
          full log
        </a>
      {/if}
    </div>
  </figure>
{/each}
