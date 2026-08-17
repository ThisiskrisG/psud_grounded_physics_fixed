#!/usr/bin/env python3
"""Prepare the Long Island Lumina Sandbox for itch.io upload."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
DIST = ROOT / "dist"
SCREENSHOTS = ROOT / "screenshots"


def copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def build_manifest() -> dict[str, object]:
    return {
        "title": "Long Island Lumina Sandbox",
        "target": "itch.io HTML5",
        "entry": "index.html",
        "sandboxedEntry": "sandbox.html",
        "description": "A browser game prototype about talent, lighting, and staging across fictional progressive Long Island-inspired suburb city-states.",
        "controls": ["A/D or arrows to move", "W/Space/Up to jump", "1-4 to switch stages", "Click/tap to place spotlight"],
        "capabilities": {
            "network": False,
            "cookies": False,
            "localStorage": False,
            "camera": False,
            "microphone": False,
            "location": False,
        },
        "screenshots": sorted(path.name for path in SCREENSHOTS.glob("*.svg")),
    }


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)
    copy_file(SRC / "game.html", DIST / "index.html")
    copy_file(SRC / "sandbox.html", DIST / "sandbox.html")
    for screenshot in SCREENSHOTS.glob("*.svg"):
        copy_file(screenshot, DIST / "screenshots" / screenshot.name)
    (DIST / "itch-manifest.json").write_text(json.dumps(build_manifest(), indent=2) + "\n", encoding="utf-8")
    print(f"Built itch.io package in {DIST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
