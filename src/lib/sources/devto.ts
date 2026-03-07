import type { Headline, SourceDef } from '../types.js';

const devto: SourceDef = {
  id: 'devto',
  name: 'dev.to',
  prefix: '[dev]',
  url: 'dev.to',
  defaultEnabled: false,
  async fetch(count) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10_000);
    try {
      const r = await fetch(`https://dev.to/api/articles?per_page=${count}`, { signal: ctrl.signal });
      const items: { title: string }[] = await r.json();
      return items.map(i => ({ title: i.title, source: 'devto' }));
    } finally { clearTimeout(t); }
  },
};

export default devto;
