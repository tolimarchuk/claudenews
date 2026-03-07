import type { Headline, SourceDef } from '../types.js';
import hackernews from './hackernews.js';
import reddit from './reddit.js';
import lobsters from './lobsters.js';
import devto from './devto.js';
import githubTrending from './github-trending.js';

const allSources: SourceDef[] = [hackernews, reddit, lobsters, devto, githubTrending];

export function getAllSources(): SourceDef[] {
  return allSources;
}

export function getPrefix(source: string): string {
  return allSources.find(s => s.id === source)?.prefix ?? `[${source}]`;
}

export async function fetchAllHeadlines(
  enabledIds: string[],
  countPerSource: number,
): Promise<Headline[]> {
  const sources = allSources.filter(s => enabledIds.includes(s.id));
  const results = await Promise.allSettled(sources.map(s => s.fetch(countPerSource)));
  const headlines: Headline[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') headlines.push(...result.value);
  }
  // Fisher-Yates shuffle
  for (let i = headlines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [headlines[i], headlines[j]] = [headlines[j], headlines[i]];
  }
  return headlines;
}
