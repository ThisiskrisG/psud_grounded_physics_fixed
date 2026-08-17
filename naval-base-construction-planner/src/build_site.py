#!/usr/bin/env python3
"""Generate fictional construction planning artifacts for the naval base demo.

The output is intentionally high-level and suitable for visualization/storyboarding,
not real-world facility engineering or security planning.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


@dataclass(frozen=True)
class Rect:
    """A simple rectangular area in planner units."""

    name: str
    x: int
    y: int
    width: int
    height: int
    fill: str
    label: str
    level: str = "public"


@dataclass(frozen=True)
class BuildingBlock(Rect):
    """Building massing block with construction metadata."""

    floors: int = 1
    phase: str = "Phase 1"


@dataclass(frozen=True)
class StreetElement(Rect):
    """Street-view element rendered as elevation scenery."""

    depth: int = 0


def floor_rooms() -> list[Rect]:
    return [
        Rect("atrium", 40, 40, 160, 120, "#6ee7f9", "Visitor Atrium", "public"),
        Rect("ops", 220, 40, 220, 120, "#93c5fd", "Operations Room", "restricted"),
        Rect("briefing", 460, 40, 160, 120, "#fcd34d", "Briefing", "controlled"),
        Rect("workshop", 40, 190, 230, 150, "#fca5a5", "Maintenance Shop", "controlled"),
        Rect("admin", 300, 190, 150, 150, "#c4b5fd", "Admin", "public"),
        Rect("secure_core", 480, 190, 140, 150, "#f87171", "Secure Core", "restricted"),
        Rect("corridor", 40, 360, 580, 52, "#e5e7eb", "Main Corridor", "circulation"),
    ]


def site_zones() -> list[Rect]:
    return [
        Rect("water", 0, 0, 920, 210, "#0f5f8f", "Harbor Water", "environment"),
        Rect("pier_alpha", 130, 80, 210, 72, "#94a3b8", "Pier Alpha", "controlled"),
        Rect("quay", 0, 210, 920, 52, "#64748b", "Quay Wall", "controlled"),
        Rect("ops_center", 110, 330, 190, 135, "#38bdf8", "Operations Center", "restricted"),
        Rect("hangar", 350, 315, 260, 160, "#a78bfa", "Maintenance Hangar", "controlled"),
        Rect("logistics", 660, 330, 180, 125, "#f59e0b", "Logistics Yard", "controlled"),
        Rect("gate", 390, 570, 140, 70, "#22c55e", "Front Gate", "public"),
        Rect("street", 0, 660, 920, 72, "#1f2937", "Street View Road", "public"),
    ]


def building_blocks() -> list[BuildingBlock]:
    return [
        BuildingBlock("foundation", 80, 330, 210, 85, "#475569", "Foundation + Utility Pod", "controlled", 1, "Phase 1"),
        BuildingBlock("tower", 120, 205, 132, 125, "#38bdf8", "Command Block", "restricted", 4, "Phase 2"),
        BuildingBlock("hangar_shell", 345, 255, 245, 160, "#a78bfa", "Hangar Shell", "controlled", 2, "Phase 2"),
        BuildingBlock("admin_wing", 625, 310, 150, 105, "#c4b5fd", "Admin Wing", "public", 2, "Phase 3"),
        BuildingBlock("roof_arrays", 138, 175, 96, 30, "#fcd34d", "Roof Arrays", "controlled", 1, "Phase 4"),
    ]


def street_elements() -> list[StreetElement]:
    return [
        StreetElement("road", 0, 410, 920, 110, "#1f2937", "Harbor Avenue", "public", 0),
        StreetElement("sidewalk", 0, 370, 920, 38, "#94a3b8", "Sidewalk", "public", 0),
        StreetElement("gatehouse", 380, 248, 160, 122, "#22c55e", "Gatehouse", "public", 18),
        StreetElement("ops_elevation", 90, 165, 210, 205, "#38bdf8", "Operations Elevation", "restricted", 42),
        StreetElement("hangar_elevation", 590, 190, 250, 180, "#a78bfa", "Hangar Elevation", "controlled", 30),
        StreetElement("light_a", 330, 235, 18, 135, "#fde68a", "Street Light", "public", 5),
        StreetElement("light_b", 555, 235, 18, 135, "#fde68a", "Street Light", "public", 5),
    ]


def svg_rects(rects: Iterable[Rect], width: int, height: int, title: str) -> str:
    body = []
    for rect in rects:
        body.append(
            f'<rect x="{rect.x}" y="{rect.y}" width="{rect.width}" height="{rect.height}" '
            f'rx="10" fill="{rect.fill}" stroke="#0f172a" stroke-width="3" />'
        )
        body.append(
            f'<text x="{rect.x + rect.width / 2}" y="{rect.y + rect.height / 2}" '
            f'text-anchor="middle" dominant-baseline="middle" '
            f'font-family="Inter, Arial" font-size="16" fill="#0f172a">{rect.label}</text>'
        )
    return "\n".join(
        [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img">',
            f'<title>{title}</title>',
            '<rect width="100%" height="100%" fill="#f8fafc" />',
            *body,
            '</svg>',
        ]
    )


def build_manifest() -> dict[str, object]:
    return {
        "name": "naval-base-construction-planner",
        "disclaimer": "Fictional high-level visualization scaffold; not real engineering or security guidance.",
        "views": {
            "building": [asdict(block) for block in building_blocks()],
            "floorPlan": [asdict(room) for room in floor_rooms()],
            "navalBase": [asdict(zone) for zone in site_zones()],
            "streetView": [asdict(element) for element in street_elements()],
        },
        "constructionPhases": [
            "Phase 1: prepare fictional foundation and utility pod",
            "Phase 2: raise command block and hangar shell",
            "Phase 3: connect public admin wing and circulation",
            "Phase 4: install rooftop arrays, signage, and landscape buffers",
        ],
    }


def main() -> None:
    DIST.mkdir(parents=True, exist_ok=True)
    manifest = build_manifest()
    (DIST / "site-plan.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    (DIST / "floor-plan.svg").write_text(
        svg_rects(floor_rooms(), 660, 450, "Fictional building floor plan"),
        encoding="utf-8",
    )
    print(f"Wrote {(DIST / 'site-plan.json').relative_to(ROOT)}")
    print(f"Wrote {(DIST / 'floor-plan.svg').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
