export const AUTHOR = 'kfv';

export const REPOS = [
  {
    owner: 'freebsd',
    name: 'freebsd-src',
    author: AUTHOR,
    url: 'https://github.com/freebsd/freebsd-src',
    logUrl: `https://cgit.freebsd.org/src/log/?qt=author&q=${AUTHOR}`,
    commitUrl: sha => `https://cgit.freebsd.org/src/commit/?id=${sha}`,
    limit: 12,
  },
];
