# Wobble House Rally AI Collider

**Auto-generated repository name:** `wobble-house-rally-ai-collider`

A self-contained storyboard and prototype seed for a ground-up game engine where an AI observer watches a car launch from a funny house, collide with physics props, and learn the scene from a low ground-level camera.

## Concept

The project starts from a simple but expressive scene:

1. A crooked, funny house opens its garage door.
2. A tiny rally car rolls out onto a springy street.
3. The car collides with barrels, mailboxes, cones, crates, and wobble signs.
4. A ground-level AI observer scans the collisions and narrates what it sees.
5. Each collision creates a storyboard beat that can later become training data, replay metadata, or a cinematic shot.

## Repository goals

- Define a storyboard-first design for physics collisions and AI observation.
- Provide a browser-only prototype that runs without installing packages.
- Establish a clean path toward a real engine with reusable scene, physics, AI-observer, and replay systems.

## Files

- [`docs/STORYBOARD.md`](docs/STORYBOARD.md) — cinematic and gameplay storyboard from the ground up.
- [`src/index.html`](src/index.html) — runnable canvas prototype with car, funny house, collision props, AI scan overlay, and storyboard beats.
- [`src/engine-plan.md`](src/engine-plan.md) — proposed module architecture for expanding the prototype into a full engine.

## Run locally

Open `src/index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 4174 --directory wobble-house-rally-ai-collider/src
```

Then visit <http://127.0.0.1:4174/>.
