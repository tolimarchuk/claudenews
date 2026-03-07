import { readConfig } from '../lib/config.js';
import { refresh, isStale } from '../lib/refresh.js';

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  try {
    const config = await readConfig();
    if (isStale(config)) await refresh();
  } catch {}
}

main();
