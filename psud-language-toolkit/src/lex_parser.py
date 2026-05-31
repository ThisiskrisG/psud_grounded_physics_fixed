#!/usr/bin/env python3
"""Async lexical parser for PSUD storyboard and physics wording.

The parser classifies bracketed design language into document-ready summaries.
It is intentionally lightweight so it can run in this repository without third-party
imports while still demonstrating async syntax and future plugin/import hooks.
"""

from __future__ import annotations

import asyncio
import json
import re
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parents[0]
DIST = ROOT / "dist"
BRACKET_RE = re.compile(r"\[(?P<bracket>[A-Z_]+)\]\s*(?P<body>.+)")
WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]*")

BRACKET_DRESSERS = {
    "PHYSICS": "Physics wording explains motion, collision, force, camera movement, and pseudo-ground rules.",
    "CHARACTER": "Character wording names actors and clarifies how they behave in the scene.",
    "ENVIRONMENT": "Environment wording identifies places, props, streets, buildings, and layout context.",
    "STORYBOARD": "Storyboard wording orders beats, shots, camera direction, and replay moments.",
    "PLUGIN": "Plugin wording describes optional behavior modules that extend the prototypes.",
    "IMPORT": "Import wording describes external data or documents consumed by tooling.",
    "TONE": "Tone wording controls the rollout tongue used to explain mechanics clearly.",
}

SOURCE_FILES = [
    ROOT / "examples" / "storyboard.psud",
    ROOT / "docs" / "EXTENSIONS_PLUGINS_IMPORTS.md",
    REPO_ROOT / "wobble-house-rally-ai-collider" / "docs" / "STORYBOARD.md",
    REPO_ROOT / "wobble-house-rally-ai-collider" / "src" / "engine-plan.md",
    REPO_ROOT / "naval-base-construction-planner" / "README.md",
]


@dataclass(frozen=True)
class Token:
    """A lexed word or bracket marker."""

    kind: str
    value: str
    line: int


@dataclass(frozen=True)
class ClassifiedLine:
    """A bracketed line and the wording extracted from it."""

    source: str
    line: int
    bracket: str
    body: str
    keywords: list[str]
    dresser: str


async def read_text(path: Path) -> tuple[Path, str]:
    """Read a document asynchronously through a worker thread."""

    text = await asyncio.to_thread(path.read_text, encoding="utf-8")
    return path, text


def lex_line(line: str, line_number: int) -> list[Token]:
    """Tokenize one line into bracket and word tokens."""

    tokens: list[Token] = []
    match = BRACKET_RE.search(line)
    if match:
        tokens.append(Token("bracket", match.group("bracket"), line_number))
    tokens.extend(Token("word", word.lower(), line_number) for word in WORD_RE.findall(line))
    return tokens


def classify_line(source: Path, line: str, line_number: int) -> ClassifiedLine | None:
    """Return a classified line when bracket syntax is present."""

    match = BRACKET_RE.search(line)
    if not match:
        return None
    bracket = match.group("bracket")
    body = match.group("body").strip()
    keywords = [word.value for word in lex_line(body, line_number) if word.kind == "word"][:10]
    return ClassifiedLine(
        source=str(source.relative_to(REPO_ROOT)),
        line=line_number,
        bracket=bracket,
        body=body,
        keywords=keywords,
        dresser=BRACKET_DRESSERS.get(bracket, "Unregistered bracket; review wording before publishing."),
    )


async def classify_document(path: Path) -> dict[str, object]:
    """Classify one document and return structured parser output."""

    source, text = await read_text(path)
    lines = text.splitlines()
    tokens = [token for index, line in enumerate(lines, 1) for token in lex_line(line, index)]
    classified = [item for index, line in enumerate(lines, 1) if (item := classify_line(source, line, index))]
    word_counts = Counter(token.value for token in tokens if token.kind == "word")
    bracket_counts = Counter(item.bracket for item in classified)
    return {
        "source": str(source.relative_to(REPO_ROOT)),
        "tokenCount": len(tokens),
        "bracketCounts": dict(sorted(bracket_counts.items())),
        "topWords": word_counts.most_common(12),
        "classifiedLines": [asdict(item) for item in classified],
    }


def summarize_brackets(documents: list[dict[str, object]]) -> dict[str, object]:
    """Build a repository-level bracket summary."""

    totals: Counter[str] = Counter()
    sources: defaultdict[str, list[str]] = defaultdict(list)
    for document in documents:
        for bracket, count in document["bracketCounts"].items():
            totals[bracket] += count
            sources[bracket].append(document["source"])
    return {
        "totals": dict(sorted(totals.items())),
        "sources": {bracket: sorted(set(paths)) for bracket, paths in sorted(sources.items())},
        "dressers": BRACKET_DRESSERS,
    }


def wording_guide(summary: dict[str, object], documents: list[dict[str, object]]) -> str:
    """Render a markdown guide that explains wording classifications."""

    lines = [
        "# Generated PSUD Wording Guide",
        "",
        "This file is generated by `psud-language-toolkit/src/lex_parser.py`.",
        "It arranges pseudo-ground-physics and storyboard wording into classification brackets.",
        "",
        "## Classification bracket totals",
        "",
    ]
    totals = summary["totals"]
    if totals:
        for bracket, count in totals.items():
            lines.append(f"- **[{bracket}]** — {count} item(s). {BRACKET_DRESSERS.get(bracket, '')}")
    else:
        lines.append("- No bracketed wording was found.")

    lines.extend([
        "",
        "## Document dressers",
        "",
        "Document dressers convert raw bracket lines into reader-friendly explanations:",
        "",
    ])
    for bracket, dresser in BRACKET_DRESSERS.items():
        lines.append(f"- **{bracket} dresser:** {dresser}")

    lines.extend([
        "",
        "## Development hooks",
        "",
        "- **Extensions** should declare which bracket they extend before adding behavior.",
        "- **Plugins** should stay optional and list their physics/storyboard hooks.",
        "- **Imports** should describe character, environment, and wording impact before code consumes them.",
        "- **Characters** should be tagged with `[CHARACTER]` and connected to `[PHYSICS]` actions.",
        "- **Environments** should be tagged with `[ENVIRONMENT]` and connected to `[STORYBOARD]` beats.",
        "",
        "## Classified examples",
        "",
    ])
    for document in documents:
        classified = document["classifiedLines"]
        if not classified:
            continue
        lines.append(f"### {document['source']}")
        lines.append("")
        for item in classified[:12]:
            lines.append(f"- **[{item['bracket']}]** line {item['line']}: {item['body']}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


async def main_async() -> None:
    """Parse configured sources and write generated documents."""

    DIST.mkdir(parents=True, exist_ok=True)
    existing_sources = [path for path in SOURCE_FILES if path.exists()]
    documents = await asyncio.gather(*(classify_document(path) for path in existing_sources))
    summary = summarize_brackets(documents)
    payload = {
        "tool": "psud-language-toolkit",
        "purpose": "Classify wording for pseudo-ground physics, storyboards, extensions, plugins, imports, characters, and environments.",
        "asyncSyntax": "Documents are loaded with asyncio.gather and asyncio.to_thread before classification.",
        "summary": summary,
        "documents": documents,
    }
    (DIST / "classified-documents.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    (DIST / "wording-guide.md").write_text(wording_guide(summary, documents), encoding="utf-8")
    print(f"Classified {len(documents)} document(s)")
    print(f"Wrote {(DIST / 'classified-documents.json').relative_to(ROOT)}")
    print(f"Wrote {(DIST / 'wording-guide.md').relative_to(ROOT)}")


def main() -> None:
    """CLI entrypoint."""

    asyncio.run(main_async())


if __name__ == "__main__":
    main()
