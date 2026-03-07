# claudenews

News headlines in your Claude Code spinner.

Before:
```
⠋ Cogitating...
⠙ Thinking...
⠹ Pondering...
```

After:
```
+ [HN] Show HN: I built a real-time collaborative text editor in Rust
+ [🦞] Fortify your app: Essential strategies to strengthen security…
+ [GH] jj-vcs/jj — A Git-compatible VCS that is both simple and powerful
+ [dev] Why SQLite is the secret weapon for modern dev workflows
+ [/r] Linux 6.14 officially drops ReiserFS
```

## Install

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
  [x] [/r] Reddit                reddit.com
  [x] [🦞] Lobsters              lobste.rs
  [x] [dev] dev.to               dev.to
  [x] [GH] GitHub Trending       github.com/trending

[Space] Toggle  [r] Refresh  [q] Quit | by souls.zip & @tolibear_
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

## Contributing

Open source contributors are welcome! Feel free to open issues or submit pull requests.

## License

MIT

---

Built by [souls.zip](https://souls.zip)
