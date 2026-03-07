import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import React from 'react';
import { render } from 'ink';
import { getConfigDir, readConfig, writeConfig } from './lib/config.js';
import { refresh } from './lib/refresh.js';
import { installHooks, removeHooks, restoreDefaultVerbs } from './lib/settings.js';
import App from './app.js';

async function autoSetup(): Promise<void> {
  const configPath = `${getConfigDir()}/config.json`;
  if (existsSync(configPath)) return;

  await mkdir(getConfigDir(), { recursive: true });
  await writeConfig(await readConfig());
  try { await refresh(); } catch {}
  await installHooks();
}

async function uninstall(): Promise<void> {
  console.log('Uninstalling claudenews...\n');
  await removeHooks();
  await restoreDefaultVerbs();
  try {
    await rm(getConfigDir(), { recursive: true });
    console.log(`Removed ${getConfigDir()}`);
  } catch {}
  console.log('Done! Spinner restored to defaults.');
}

async function main(): Promise<void> {
  if (process.argv.includes('--uninstall')) {
    await uninstall();
    return;
  }
  await autoSetup();
  render(React.createElement(App));
}

main();
