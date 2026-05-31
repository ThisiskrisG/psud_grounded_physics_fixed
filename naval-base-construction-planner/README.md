# Naval Base Construction Planner

A Python + HTML construction concept package for planning a secure waterfront facility with four connected views:

1. **Building construction view** — massing blocks, construction phases, and heights.
2. **Floor plan view** — rooms, circulation, restricted zones, and service cores.
3. **Naval base site view** — pier, quay, hangar, operations center, logistics yard, and security perimeter.
4. **Street view** — ground-level road frontage with gatehouse, sidewalks, lighting, and visible building elevations.

> Planning note: this is a fictional visualization scaffold for layout, storytelling, and early product design. It is not engineering, security, legal, or operational guidance for a real naval installation.

## Files

- `src/build_site.py` — Python construction model that generates JSON and SVG artifacts.
- `src/index.html` — browser-based planner with tabs for building, floor plan, naval base, and street view.
- `dist/site-plan.json` — generated site model.
- `dist/floor-plan.svg` — generated floor plan drawing.

## Generate artifacts

```bash
python3 naval-base-construction-planner/src/build_site.py
```

## Run the HTML planner

```bash
python3 -m http.server 4175 --directory naval-base-construction-planner/src
```

Then visit <http://127.0.0.1:4175/>.
