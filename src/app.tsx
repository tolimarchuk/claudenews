import { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { readConfig, writeConfig } from './lib/config.js';
import { getAllSources } from './lib/sources/index.js';
import { refresh } from './lib/refresh.js';
import type { SourceDef } from './lib/types.js';

export default function App() {
  const { exit } = useApp();
  const [sources, setSources] = useState<SourceDef[]>([]);
  const [enabled, setEnabled] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const [status, setStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await readConfig();
      setEnabled(config.enabledSources);
      setSources(getAllSources());
      // Auto-refresh on open
      try {
        await refresh();
        setStatus('Headlines updated — restart Claude Code to apply');
      } catch {}
    })();
  }, []);

  // Periodic refresh
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        await refresh();
        setStatus('Headlines updated — restart Claude Code to apply');
      } catch {}
    }, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useInput((input, key) => {
    if (input === 'q') return exit();
    if (key.upArrow || input === 'k') setCursor(i => Math.max(0, i - 1));
    if (key.downArrow || input === 'j') setCursor(i => Math.min(sources.length - 1, i + 1));
    if (input === ' ') {
      const src = sources[cursor];
      if (!src) return;
      setEnabled(prev => {
        const next = prev.includes(src.id)
          ? prev.filter(id => id !== src.id)
          : [...prev, src.id];
        setStatus('Saving...');
        readConfig().then(config => {
          writeConfig({ ...config, enabledSources: next })
            .then(() => refresh())
            .then(() => setStatus('Updated — restart Claude Code to apply'))
            .catch(() => setStatus('Failed to refresh'));
        });
        return next;
      });
    }
    if (input === 'r' && !refreshing) {
      setRefreshing(true);
      setStatus('Refreshing headlines...');
      refresh()
        .then(() => setStatus('Refreshed — restart Claude Code to apply'))
        .catch(() => setStatus('Failed to refresh'))
        .finally(() => setRefreshing(false));
    }
  });

  if (sources.length === 0) {
    return <Text dimColor>Loading...</Text>;
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>claudenews</Text>
        <Text dimColor> — pick your news sources</Text>
      </Box>

      {sources.map((src, i) => {
        const active = i === cursor;
        const on = enabled.includes(src.id);
        return (
          <Box key={src.id}>
            <Text bold={active}>
              {active ? '> ' : '  '}
              {on ? '[x]' : '[ ]'} {src.prefix} {src.name}
            </Text>
            <Text dimColor> {src.url}</Text>
          </Box>
        );
      })}

      <Box marginTop={1} justifyContent="space-between">
        <Text dimColor>
          [Space] Toggle  [r] Refresh  [q] Quit
        </Text>
        <Text dimColor>built by souls.zip</Text>
      </Box>

      {status && (
        <Box marginTop={0}>
          <Text dimColor>{status}</Text>
        </Box>
      )}
    </Box>
  );
}
