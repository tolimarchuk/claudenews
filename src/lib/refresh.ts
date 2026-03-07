import { readConfig, writeConfig } from './config.js';
import { fetchAllHeadlines, getPrefix } from './sources/index.js';
import { writeSpinnerVerbs } from './settings.js';

export async function refresh(): Promise<void> {
  const config = await readConfig();
  const headlines = await fetchAllHeadlines(config.enabledSources, config.headlineCount);
  const MAX_LEN = 80;
  const verbs = headlines
    .map(h => {
      const prefix = getPrefix(h.source);
      const full = `${prefix} ${h.title}`;
      return full.length > MAX_LEN ? `${full.slice(0, MAX_LEN - 1)}…` : full;
    })
    .filter(v => v.length > 0);
  await writeSpinnerVerbs(verbs);
  await writeConfig({ ...config, lastRefresh: new Date().toISOString() });
}

export function isStale(config: { lastRefresh?: string; refreshIntervalMinutes: number }): boolean {
  if (!config.lastRefresh) return true;
  const age = Date.now() - new Date(config.lastRefresh).getTime();
  return age > config.refreshIntervalMinutes * 60 * 1000;
}
