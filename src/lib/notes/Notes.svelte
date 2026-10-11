<script>
  import { ACTOR } from './config.js';
  import { loadOlderNotes } from './bluesky.js';
  import './Notes.css';

  export let feed = { threads: [], cursor: null, more: false };

  const initial = new Set(feed.threads.map(t => t.uri));

  let busy = false;
  let error = '';

  function isoDate(value) {
    if (!value) return '';
    return value.slice(0, 10);
  }

  async function older() {
    busy = true;
    error = '';

    try {
      feed = await loadOlderNotes(feed, fetch);
    } catch (err) {
      const limited = err?.status === 403 || err?.status === 429;
      error = limited ? 'rate limited, try later' : 'could not load';
    } finally {
      busy = false;
    }
  }
</script>

<article class="page">
  <figure class="notes stage-rise">
    {#if feed.threads.length}
      <ol class="notes-threads">
        {#each feed.threads as thread, i (thread.uri)}
          <li
            class="notes-thread stage-rise"
            class:notes-loaded={!initial.has(thread.uri)}
            style="--i: {i}"
          >
            <ol class="notes-posts">
              {#each thread.posts as post, n (post.uri)}
                <li class="notes-post">
                  <div class="notes-meta">
                    <a class="notes-date duration-500" href={post.url}>
                      <time datetime={post.date}>{isoDate(post.date)}</time>
                    </a>
                    {#if thread.posts.length > 1}
                      <span class="notes-index">
                        {n + 1}/{thread.posts.length}
                      </span>
                    {/if}
                  </div>

                  {#if post.segments.length}
                    <p class="notes-text">
                      {#each post.segments as seg}{#if seg.href}<a
                            href={seg.href}>{seg.text}</a
                          >{:else}{seg.text}{/if}{/each}
                    </p>
                  {/if}

                  {#each post.embeds as embed}
                    {#if embed.type === 'images'}
                      <div
                        class="notes-images"
                        class:notes-images-grid={embed.images.length > 1}
                      >
                        {#each embed.images as img}
                          <a href={img.full ?? img.src}>
                            <img
                              src={img.src}
                              alt={img.alt}
                              loading="lazy"
                              referrerpolicy="no-referrer"
                            />
                          </a>
                        {/each}
                      </div>
                    {:else if embed.type === 'video'}
                      <a class="notes-card notes-video" href={embed.url}>
                        {#if embed.thumb}
                          <img
                            src={embed.thumb}
                            alt={embed.alt}
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        {/if}
                        <span class="notes-card-host">video on bluesky</span>
                      </a>
                    {:else if embed.type === 'external'}
                      <a
                        class="notes-card notes-external duration-500"
                        href={embed.url}
                      >
                        <span class="notes-card-body">
                          <span class="notes-card-host">{embed.host}</span>
                          {#if embed.title}
                            <span class="notes-card-title">{embed.title}</span>
                          {/if}
                          {#if embed.description}
                            <span class="notes-card-desc"
                              >{embed.description}</span
                            >
                          {/if}
                        </span>
                        {#if embed.thumb}
                          <img
                            class="notes-card-thumb"
                            src={embed.thumb}
                            alt=""
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        {/if}
                      </a>
                    {:else if embed.type === 'quote'}
                      <blockquote class="notes-card notes-quote">
                        <a
                          class="notes-quote-head duration-500"
                          href={embed.url}
                        >
                          {#if embed.name}
                            <span class="notes-quote-name">{embed.name}</span>
                          {/if}
                          <span>@{embed.handle}</span>
                          <time datetime={embed.date}>
                            {isoDate(embed.date)}
                          </time>
                        </a>
                        {#if embed.segments.length}
                          <p class="notes-text">
                            {#each embed.segments as seg}{#if seg.href}<a
                                  href={seg.href}>{seg.text}</a
                                >{:else}{seg.text}{/if}{/each}
                          </p>
                        {/if}
                      </blockquote>
                    {:else if embed.type === 'gone'}
                      <p class="notes-card notes-gone">
                        quoted post unavailable
                      </p>
                    {/if}
                  {/each}
                </li>
              {/each}
            </ol>
          </li>
        {/each}
      </ol>
    {:else}
      <p class="notes-empty">no notes yet</p>
    {/if}

    <div class="notes-foot">
      {#if feed.more}
        <button
          class="notes-more"
          type="button"
          disabled={busy}
          on:click={older}
        >
          {busy ? 'loading…' : 'older'}
        </button>
      {/if}
      <span class="notes-status" role="status">{error}</span>
      <a class="notes-full duration-500" href={ACTOR.url}>
        on bluesky
        <i class="fa-brands fa-bluesky"></i>
      </a>
    </div>
  </figure>
</article>
