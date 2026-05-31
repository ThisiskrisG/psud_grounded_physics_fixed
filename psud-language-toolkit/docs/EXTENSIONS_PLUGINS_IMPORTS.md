# Extensions, Plugins, and Imports for Characters + Environments

## Purpose

This guide explains how future modules should grow the pseudo-ground-physics and storyboard systems without mixing up wording, mechanics, or responsibilities.

## Classification brackets

Use these brackets in design notes, storyboard beats, plugin manifests, and imported character/environment files:

- `[PHYSICS]` — gravity, collision, impulses, camera shake, friction, rifts, teleport motion, vehicle motion, ground contact.
- `[CHARACTER]` — named actors such as the camera drone, Peanut Rally Car, AI Lookout, applicants, crew, or narrative guides.
- `[ENVIRONMENT]` — arenas, funny houses, naval base zones, streets, floors, piers, hangars, gates, rooms, props, and weather.
- `[STORYBOARD]` — beats, shots, camera moves, scene sequence, replay cards, and visual direction.
- `[PLUGIN]` — optional modules that add behavior while keeping the base prototype stable.
- `[IMPORT]` — data files brought into the system, such as JSON floor plans, SVG layouts, character sheets, or generated manifests.
- `[TONE]` — rollout tongue: the voice used to explain mechanics to players, developers, or reviewers.

## Extension pattern

An **extension** expands an existing system. For example:

```text
[PLUGIN] physics.replay_vectors
[IMPORT] dist/site-plan.json
[PHYSICS] Draw impulse arrows for collisions.
[STORYBOARD] Add replay cards after each high-impact event.
```

Recommended extension fields:

| Field | Meaning |
| --- | --- |
| `name` | Stable module name. |
| `bracket` | Primary classification bracket. |
| `imports` | JSON/SVG/markdown/assets consumed by the module. |
| `characters` | Characters affected or introduced. |
| `environments` | Environments affected or introduced. |
| `physicsHooks` | Physics events the module reads or writes. |
| `storyboardHooks` | Beats or camera moments the module affects. |

## Plugin pattern

A **plugin** should be optional and reversible. It should not rewrite core state directly unless it owns that part of the system.

Example plugin manifest:

```json
{
  "name": "ai-lookout-comedy-scorer",
  "bracket": "PLUGIN",
  "imports": ["wobble-house-rally-ai-collider/docs/STORYBOARD.md"],
  "characters": ["AI Lookout", "Peanut Rally Car"],
  "environments": ["Wobble House street"],
  "physicsHooks": ["collision.recorded", "body.grounded"],
  "storyboardHooks": ["03 Barrel surprise", "06 AI replay"]
}
```

## Import pattern

An **import** should describe what it contributes before code consumes it:

```text
[IMPORT] naval-base-construction-planner/dist/floor-plan.svg
[ENVIRONMENT] Adds floor-plan rooms and circulation.
[STORYBOARD] Supports construction walkthrough shots.
[TONE] Explain as fictional planning visualization, not real operations guidance.
```

## Character development hooks

Characters become stronger when their wording is classified consistently:

- `[CHARACTER] AI Lookout` should speak in short observation sentences.
- `[CHARACTER] Peanut Rally Car` should be described through motion, wobble, and collision reactions.
- `[CHARACTER] Camera Drone` should be described through lens gates, teleport rifts, and scanning verbs.

## Environment development hooks

Environments should expose both story and physics meaning:

- `[ENVIRONMENT] Funny House` is a story origin and a physical launch point.
- `[ENVIRONMENT] Teleport Arena` is a physics sandbox with boundaries, rifts, and particles.
- `[ENVIRONMENT] Naval Base Planner` is a fictional layout visualization with building/floor/street/site views.

## Rollout tongue guide

Use wording that is vivid but clear:

- Prefer: "The car compresses the bumper, then launches upward."
- Avoid: "The bumper happens and stuff goes wild."
- Prefer: "The AI Lookout labels the impact as a high-energy collision."
- Avoid: "AI sees it."

The parser in `src/lex_parser.py` reads these brackets and turns them into structured outputs for review.
