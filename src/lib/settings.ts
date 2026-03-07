import { readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json');

interface ClaudeSettings {
  [key: string]: unknown;
  spinnerVerbs?: { mode: string; verbs: string[] };
  hooks?: { [event: string]: HookEntry[] };
}

interface HookEntry {
  matcher?: string;
  hooks: { type: string; command: string; timeout?: number }[];
}

async function readSettings(): Promise<ClaudeSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveSettings(settings: ClaudeSettings): Promise<void> {
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n');
}

export async function writeSpinnerVerbs(verbs: string[]): Promise<void> {
  const settings = await readSettings();
  settings.spinnerVerbs = { mode: 'replace', verbs };
  await saveSettings(settings);
}

export async function restoreDefaultVerbs(): Promise<void> {
  const settings = await readSettings();
  delete settings.spinnerVerbs;
  await saveSettings(settings);
}

function getDistDir(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..');
}

function getHookCommand(scriptName: string): string {
  return `node "${join(getDistDir(), 'hooks', scriptName)}"`;
}

const MARKER = 'claudenews';

export async function installHooks(): Promise<void> {
  const settings = await readSettings();
  if (!settings.hooks) settings.hooks = {};

  for (const [event, script, timeout] of [
    ['SessionStart', 'on-session-start.js', 15000],
    ['PreToolUse', 'on-pre-tool-use.js', 10000],
  ] as const) {
    const cmd = getHookCommand(script);
    if (!settings.hooks[event]) settings.hooks[event] = [];
    const existing = settings.hooks[event].find(
      e => e.hooks?.some(h => h.command.includes(MARKER))
    );
    const hookEntry = { type: 'command' as const, command: cmd, timeout };
    if (existing) {
      existing.hooks = [hookEntry];
    } else {
      settings.hooks[event].push({ hooks: [hookEntry] });
    }
  }

  await saveSettings(settings);
}

export async function removeHooks(): Promise<void> {
  const settings = await readSettings();
  if (!settings.hooks) return;

  for (const event of Object.keys(settings.hooks)) {
    settings.hooks[event] = settings.hooks[event].filter(
      e => !e.hooks?.some(h => h.command.includes(MARKER))
    );
    if (settings.hooks[event].length === 0) delete settings.hooks[event];
  }
  if (Object.keys(settings.hooks).length === 0) delete settings.hooks;

  await saveSettings(settings);
}
