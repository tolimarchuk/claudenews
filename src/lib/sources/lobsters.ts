import type { Headline, SourceDef } from '../types.js';

const lobsters: SourceDef = {
  id: 'lobsters',
  name: 'Lobsters',
  prefix: '[🦞]',
  url: 'lobste.rs',
  defaultEnabled: false,
  async fetch(count) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const r = await fetch('https://lobste.rs/hottest.json', { signal: ctrl.signal });
      const items: { title: string }[] = await r.json();
      return items.slice(0, count).map(i => ({ title: i.title, source: 'lobsters' }));
    } finally { clearTimeout(t); }
  },
};

export default lobsters;
