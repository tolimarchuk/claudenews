import type { Headline, SourceDef } from '../types.js';

interface GHRepo { author: string; name: string; description: string; }

const githubTrending: SourceDef = {
  id: 'github',
  name: 'GitHub Trending',
  prefix: '[GH]',
  url: 'github.com/trending',
  defaultEnabled: false,
  async fetch(count) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const r = await fetch('https://ghapi.huchen.dev/repositories?since=daily', { signal: ctrl.signal });
      const repos: GHRepo[] = await r.json();
      return repos.slice(0, count).map(i => ({
        title: i.description ? `${i.author}/${i.name} — ${i.description}` : `${i.author}/${i.name}`,
        source: 'github',
      }));
    } finally { clearTimeout(t); }
  },
};

export default githubTrending;
