# Long Island Lumina Sandbox

**Long Island Lumina Sandbox** is an itch.io-ready browser game prototype that showcases lighting, staging, and player talent across fictional progressive suburb/city-state scenes inspired by Long Island.

The package includes:

- A sandbox launcher that embeds the game in a restricted iframe.
- A standalone HTML5 game for itch.io upload.
- A sandbox policy that documents allowed browser capabilities.
- Generated SVG screenshots for progressive suburb/city-state staging.
- A tiny build script that prepares the `dist/` folder.

> All locations are fictionalized and stylized for game staging. The game does not use real maps, real surveillance, or real municipal/security data.

## Run locally

```bash
python3 -m http.server 4177 --directory long-island-lumina-sandbox/src
```

Open <http://127.0.0.1:4177/sandbox.html> for the sandboxed launcher, or <http://127.0.0.1:4177/game.html> for the direct game.

## Build for itch.io

```bash
python3 long-island-lumina-sandbox/tools/build_itch_package.py
```

Upload the contents of `long-island-lumina-sandbox/dist/` to itch.io as an HTML game. Use `index.html` as the entry point.

## Controls

- **A / D** or **Arrow Left / Arrow Right** — move the performer.
- **W / Space / Arrow Up** — jump.
- **1-4** — switch city-state stage.
- **Click / tap** — place a temporary spotlight.

## Talent goal

Collect talent sparks, keep the performer in light, and move through staged Long Island-inspired scenes: Lighthouse Commons, Garden Rail, Harbor Tech, and Boardwalk Future.
