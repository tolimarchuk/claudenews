import type { Headline, SourceDef } from '../types.js';

interface HNItem { id: number; title: string; }

const hackernews: SourceDef = {
  id: 'hackernews',
  name: 'Hacker News',
  prefix: '[HN]',
  url: 'news.ycombinator.com',
  defaultEnabled: true,
  async fetch(count) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { signal: ctrl.signal });
      const ids: number[] = await res.json();
      const items = await Promise.all(
        ids.slice(0, count).map(async id => {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: ctrl.signal });
          return r.json() as Promise<HNItem>;
        })
      );
      return items.filter(i => i?.title).map(i => ({ title: i.title, source: 'hackernews' }));
    } finally { clearTimeout(t); }
  },
};

export default hackernews;
