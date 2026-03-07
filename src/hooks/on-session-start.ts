import { refresh } from '../lib/refresh.js';

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  try { await refresh(); } catch {}
}

main();
