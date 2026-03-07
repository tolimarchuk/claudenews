import type { Headline, SourceDef } from '../types.js';
import { readConfig } from '../config.js';

interface RedditResponse {
  data: { children: { data: { title: string } }[] };
}

const reddit: SourceDef = {
  id: 'reddit',
  name: 'Reddit',
  prefix: '[/r]',
  url: 'reddit.com',
  defaultEnabled: false,
  async fetch(count) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const config = await readConfig();
      const perSub = Math.max(1, Math.floor(count / config.redditSubs.length));
      const results = await Promise.all(
        config.redditSubs.map(async sub => {
          const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=${perSub}`, {
            signal: ctrl.signal,
            headers: { 'User-Agent': 'claudenews/1.0' },
          });
          return r.json() as Promise<RedditResponse>;
        })
      );
      return results.flatMap(r =>
        r.data.children.map(c => ({ title: c.data.title, source: 'reddit' }))
      );
    } finally { clearTimeout(t); }
  },
};

export default reddit;
