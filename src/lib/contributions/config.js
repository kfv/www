export const AUTHOR = 'kfv';

export const REPOS = [
  {
    owner: 'freebsd',
    name: 'freebsd-src',
    author: AUTHOR,
    url: 'https://github.com/freebsd/freebsd-src',
    commitUrl: sha => `https://cgit.freebsd.org/src/commit/?id=${sha}`,
    limit: 12,
  },
];
