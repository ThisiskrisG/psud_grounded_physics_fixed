# PSUD Language Toolkit

The **PSUD Language Toolkit** adds an automated wording/classification layer for the existing pseudo-ground-physics prototypes and storyboards. It gives writers and developers a shared vocabulary for:

- **Classification brackets** — tags that sort wording into physics, character, environment, storyboard, plugin/import, and tone categories.
- **Document dressers** — generated summaries that wrap raw notes in readable headings, purpose statements, and development hints.
- **Rollout tongue** — a controlled voice/tone guide so game documents explain mechanics consistently.
- **Exquisite lex parser** — a lightweight asynchronous Python lexer/parser that scans markdown-like documents and arranges wording into structured JSON and markdown.
- **Async syntax** — `asyncio`-based document loading/parsing so later tools can classify many storyboards, plugin docs, and import manifests at once.

## Run the parser

```bash
python3 psud-language-toolkit/src/lex_parser.py
```

Generated files:

- `dist/classified-documents.json` — machine-readable classifications and bracket counts.
- `dist/wording-guide.md` — human-readable explanation of wording, brackets, and detected development hooks.

## Why this exists

The prototypes now include teleport physics, ground-up collision physics, a construction planner, and storyboards. This toolkit helps arrange their wording so future extensions/plugins/imports can develop characters, environments, and physics rules without losing narrative intent.
