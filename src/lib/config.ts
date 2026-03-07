import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface Config {
  headlineCount: number;
  refreshIntervalMinutes: number;
  enabledSources: string[];
  redditSubs: string[];
  lastRefresh?: string;
}

const defaultConfig: Config = {
  headlineCount: 15,
  refreshIntervalMinutes: 30,
  enabledSources: ['hackernews'],
  redditSubs: ['programming', 'technology'],
};

export function getConfigDir(): string {
  return join(homedir(), '.claudenews');
}

function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}

export async function readConfig(): Promise<Config> {
  try {
    const raw = await readFile(getConfigPath(), 'utf-8');
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    return { ...defaultConfig };
  }
}

export async function writeConfig(config: Config): Promise<void> {
  const dir = getConfigDir();
  await mkdir(dir, { recursive: true });
  await writeFile(getConfigPath(), JSON.stringify(config, null, 2) + '\n');
}
