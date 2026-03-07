# claudenews

News headlines in your Claude Code spinner. Instead of "Thinking..." you get real headlines from Hacker News, Reddit, Lobsters, dev.to, and GitHub Trending.

```
* [HN] UUID package coming to Go standard library
● Searching for 1 pattern, reading 7 files...
```

## Install

```bash
npx claudenews
```

Or install globally:

```bash
npm install -g claudenews
claudenews
```

That's it. First run automatically:
- Creates config at `~/.claudenews/config.json`
- Fetches headlines from your enabled sources
- Installs Claude Code hooks for automatic refresh
- Writes headlines to your spinner

## Pick your sources

Run `claudenews` to open the source picker:

```
claudenews — pick your news sources

> [x] [HN] Hacker News          news.ycombinator.com
  [ ] [/r] Reddit                reddit.com
  [ ] [🦞] Lobsters              lobste.rs
  [ ] [dev] dev.to               dev.to
  [ ] [GH] GitHub Trending       github.com/trending

[Space] Toggle  [r] Refresh  [q] Quit          built by souls.zip
```

Headlines show up in your Claude Code spinner with source prefixes:

- `[HN]` — Hacker News
- `[/r]` — Reddit (r/programming, r/technology)
- `[🦞]` — Lobsters
- `[dev]` — dev.to
- `[GH]` — GitHub Trending

## How it works

- **Session start hook** fetches fresh headlines every time you start Claude Code
- **Pre-tool-use hook** refreshes if headlines are older than 30 minutes
- Headlines are written to `spinnerVerbs` in `~/.claude/settings.json`
- Claude Code reads spinner verbs at session startup

## Configuration

Config lives at `~/.claudenews/config.json`:

```json
{
  "headlineCount": 15,
  "refreshIntervalMinutes": 30,
  "enabledSources": ["hackernews"],
  "redditSubs": ["programming", "technology"]
}
```

- **headlineCount** — headlines per source (default: 15)
- **refreshIntervalMinutes** — how often to fetch new headlines (default: 30)
- **enabledSources** — which sources to pull from
- **redditSubs** — subreddits to include when Reddit is enabled

## Uninstall

```bash
claudenews --uninstall
```

Removes hooks, restores default spinner, and deletes config.

## Requirements

- Node.js 18+
- Claude Code

## License

MIT

---

Built by [souls.zip](https://souls.zip)
