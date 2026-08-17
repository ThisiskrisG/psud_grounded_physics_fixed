# Engine Plan

## Generated repository name

`wobble-house-rally-ai-collider`

## Architecture from the ground up

```text
Game
├── Scene
│   ├── FunnyHouse
│   ├── Car
│   ├── CollisionProps
│   └── GroundCamera
├── Physics
│   ├── Integrator
│   ├── CollisionDetection
│   ├── CollisionResolution
│   └── EventTimeline
├── AIObserver
│   ├── ObjectLabels
│   ├── CollisionNarrator
│   ├── RiskComedyScorer
│   └── ReplaySummaries
└── Storyboard
    ├── Beats
    ├── CameraShots
    ├── TriggerRules
    └── Exporter
```

## Milestone 1: single-scene prototype

- One funny house.
- One controllable car.
- Five prop types with simple circular or rectangular collision shapes.
- Ground-level camera with parallax horizon.
- On-screen AI observer feed.

## Milestone 2: collision intelligence

- Collision events record `source`, `target`, `impactSpeed`, `normal`, `position`, and `timestamp`.
- AI observer converts events into readable summaries.
- Replay overlay draws impulse arrows and ghost trails.

## Milestone 3: repository split

When this scaffold becomes a true standalone repository, keep the current files and add:

- `package.json` if build tooling becomes necessary.
- `src/physics/` for collision modules.
- `src/ai/` for observer modules.
- `src/storyboard/` for beat definitions and export schemas.
- `assets/` for house, car, prop, and logo art.
