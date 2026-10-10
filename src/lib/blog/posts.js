// Each post is src/routes/blog/<slug>/+page.svx; its front matter carries
// the title, date and description.  This is only imported from server
// loads, so the posts themselves never end up in the index bundle.
const modules = import.meta.glob('/src/routes/blog/*/+page.svx', {
  eager: true,
  import: 'metadata',
});

const month = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const posts = Object.entries(modules)
  .map(([path, meta]) => ({
    ...meta,
    date: new Date(meta.date),
    url: path.replace(/^\/src\/routes/, '').replace(/\/\+page\.svx$/, ''),
  }))
  .sort((a, b) => b.date - a.date)
  .map(p => [month.format(p.date), p.title, p.description, p.url]);
