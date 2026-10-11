import { browser } from '$app/environment';
import { ACTOR } from './config.js';
import { FALLBACK } from './fallback.js';

const API = 'https://public.api.bsky.app/xrpc';
// How far down a thread to follow; the API's own ceiling is 1000.
const THREAD_DEPTH = 100;
const POST =
  /^at:\/\/(did:[a-z]+:[A-Za-z0-9._:%-]+)\/app\.bsky\.feed\.post\/([A-Za-z0-9._:~-]{1,512})$/;
const DID = /^did:[a-z]+:[A-Za-z0-9._:%-]+$/;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Everything below comes from someone else's server and ends up in href and
// src attributes, so only plain web URLs get through.
function webUrl(value, schemes = ['https:', 'http:']) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return schemes.includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function imageUrl(value) {
  return webUrl(value, ['https:']);
}

function text(value) {
  return typeof value === 'string' ? value : '';
}

function postHref(author, rkey) {
  const handle = author?.handle;
  const who =
    typeof handle === 'string' && handle !== 'handle.invalid'
      ? handle
      : author?.did;
  return `https://bsky.app/profile/${encodeURIComponent(who)}/post/${rkey}`;
}

function featureHref(feature) {
  switch (feature?.$type) {
    case 'app.bsky.richtext.facet#link':
      return webUrl(feature.uri);
    case 'app.bsky.richtext.facet#mention':
      return DID.test(feature.did ?? '')
        ? `https://bsky.app/profile/${feature.did}`
        : null;
    case 'app.bsky.richtext.facet#tag':
      return typeof feature.tag === 'string' && feature.tag
        ? `https://bsky.app/hashtag/${encodeURIComponent(feature.tag)}`
        : null;
    default:
      return null;
  }
}

function isBoundary(bytes, i) {
  return i === bytes.length || (bytes[i] & 0xc0) !== 0x80;
}

// Facet offsets are UTF-8 byte offsets, not string indices. Anything out of
// range, overlapping, or splitting a character is dropped rather than trusted.
function segments(value, facets) {
  const bytes = encoder.encode(value);
  const spans = (Array.isArray(facets) ? facets : [])
    .map(f => ({
      start: f?.index?.byteStart,
      end: f?.index?.byteEnd,
      href: (f?.features ?? []).map(featureHref).find(Boolean),
    }))
    .filter(
      s =>
        s.href &&
        Number.isInteger(s.start) &&
        Number.isInteger(s.end) &&
        s.start >= 0 &&
        s.start < s.end &&
        s.end <= bytes.length &&
        isBoundary(bytes, s.start) &&
        isBoundary(bytes, s.end)
    )
    .sort((a, b) => a.start - b.start);

  const out = [];
  let at = 0;
  for (const span of spans) {
    if (span.start < at) continue;
    if (span.start > at) {
      out.push({ text: decoder.decode(bytes.subarray(at, span.start)) });
    }
    out.push({
      text: decoder.decode(bytes.subarray(span.start, span.end)),
      href: span.href,
    });
    at = span.end;
  }
  if (at < bytes.length) out.push({ text: decoder.decode(bytes.subarray(at)) });
  return out;
}

function hostOf(href) {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function images(view) {
  return (view?.images ?? [])
    .map(img => ({
      src: imageUrl(img?.thumb),
      full: imageUrl(img?.fullsize),
      alt: text(img?.alt),
    }))
    .filter(img => img.src);
}

function media(view, href) {
  switch (view?.$type) {
    case 'app.bsky.embed.images#view': {
      const list = images(view);
      return list.length ? { type: 'images', images: list } : null;
    }
    case 'app.bsky.embed.external#view': {
      const ext = view.external;
      const url = webUrl(ext?.uri);
      if (!url) return null;
      return {
        type: 'external',
        url,
        host: hostOf(url),
        title: text(ext.title),
        description: text(ext.description),
        thumb: imageUrl(ext.thumb),
      };
    }
    case 'app.bsky.embed.video#view':
      // HLS needs a player; link to the post instead.
      return {
        type: 'video',
        url: href,
        thumb: imageUrl(view.thumbnail),
        alt: text(view.alt),
      };
    default:
      return null;
  }
}

function quote(view) {
  switch (view?.$type) {
    case 'app.bsky.embed.record#viewRecord': {
      const match = POST.exec(view.uri ?? '');
      const value = view.value;
      if (!match || value?.$type !== 'app.bsky.feed.post') return null;
      return {
        type: 'quote',
        url: postHref(view.author, match[2]),
        handle: text(view.author?.handle),
        name: text(view.author?.displayName),
        date: text(value.createdAt),
        segments: segments(text(value.text), value.facets),
      };
    }
    case 'app.bsky.embed.record#viewNotFound':
    case 'app.bsky.embed.record#viewBlocked':
    case 'app.bsky.embed.record#viewDetached':
      return { type: 'gone' };
    default:
      return null;
  }
}

function embeds(view, href) {
  switch (view?.$type) {
    case 'app.bsky.embed.record#view':
      return [quote(view.record)].filter(Boolean);
    case 'app.bsky.embed.recordWithMedia#view':
      return [media(view.media, href), quote(view.record?.record)].filter(
        Boolean
      );
    default:
      return [media(view, href)].filter(Boolean);
  }
}

function normalizePost(post) {
  const match = POST.exec(post?.uri ?? '');
  const record = post?.record;
  if (!match || match[1] !== ACTOR.did || post.author?.did !== ACTOR.did) {
    return null;
  }
  if (record?.$type !== 'app.bsky.feed.post') return null;

  const url = postHref(post.author, match[2]);

  return {
    uri: post.uri,
    url,
    date: text(record.createdAt),
    segments: segments(text(record.text), record.facets),
    embeds: embeds(post.embed, url),
  };
}

function byDate(a, b) {
  return (b.date || '').localeCompare(a.date || '');
}

function headers() {
  const h = { Accept: 'application/json' };
  if (!browser) h['User-Agent'] = 'kfv.io';
  return h;
}

async function xrpc(method, params, fetchImpl) {
  const res = await fetchImpl(
    `${API}/${method}?${new URLSearchParams(params)}`,
    {
      headers: headers(),
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!res.ok) {
    const err = new Error(`Bluesky API ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Walks down from the top post, following only my own replies, so a reply
// of mine to someone else's comment doesn't get spliced into the thread.
function selfReplies(node, seen = new Set()) {
  const out = [];
  for (const child of Array.isArray(node?.replies) ? node.replies : []) {
    if (child?.$type !== 'app.bsky.feed.defs#threadViewPost') continue;
    const post = normalizePost(child.post);
    if (!post || seen.has(post.uri)) continue;
    seen.add(post.uri);
    out.push(post, ...selfReplies(child, seen));
  }
  return out;
}

async function loadThread(root, replyCount, fetchImpl) {
  if (!(replyCount > 0)) return { uri: root.uri, posts: [root] };

  try {
    const payload = await xrpc(
      'app.bsky.feed.getPostThread',
      { uri: root.uri, depth: String(THREAD_DEPTH), parentHeight: '0' },
      fetchImpl
    );
    const replies = selfReplies(payload?.thread, new Set([root.uri]));
    return {
      uri: root.uri,
      posts: [root, ...replies.sort((a, b) => -byDate(a, b))],
    };
  } catch {
    // A thread that won't load still shows its opening post.
    return { uri: root.uri, posts: [root] };
  }
}

// The author feed is asked for top-level posts only, and each thread is then
// fetched whole. posts_and_author_threads looks like the obvious filter, but
// it drops a self-reply that falls on a page boundary and moves the cursor
// past it, so the reply never comes back on any page.
async function fetchFeedPage(cursor, fetchImpl) {
  const params = {
    actor: ACTOR.did,
    filter: 'posts_no_replies',
    limit: String(ACTOR.limit),
  };
  if (cursor) params.cursor = cursor;

  const payload = await xrpc('app.bsky.feed.getAuthorFeed', params, fetchImpl);
  if (!Array.isArray(payload?.feed)) {
    throw new Error('unexpected Bluesky response');
  }

  const roots = payload.feed
    // Reposts and pins carry a reason; only plain posts are notes.
    .filter(item => !item?.reason && !item?.post?.record?.reply)
    .map(item => ({
      post: normalizePost(item.post),
      replies: item.post?.replyCount,
    }))
    .filter(r => r.post);

  const threads = await Promise.all(
    roots.map(r => loadThread(r.post, r.replies, fetchImpl))
  );

  const next = typeof payload.cursor === 'string' ? payload.cursor : null;
  return {
    threads,
    cursor: next,
    more: Boolean(next) && payload.feed.length > 0,
  };
}

export async function loadNotes(fetchImpl) {
  try {
    const page = await fetchFeedPage(null, fetchImpl);
    if (page.threads.length) return page;
  } catch {
    // fall through
  }
  // No cursor and more set: "older" starts again from the top and merges.
  return { threads: FALLBACK, cursor: null, more: true };
}

export async function loadOlderNotes(feed, fetchImpl) {
  const page = await fetchFeedPage(feed.cursor, fetchImpl);
  const seen = new Set(feed.threads.map(t => t.uri));

  return {
    threads: feed.threads
      .concat(page.threads.filter(t => !seen.has(t.uri)))
      .sort((a, b) => byDate(a.posts[0], b.posts[0])),
    cursor: page.cursor,
    more: page.more,
  };
}
