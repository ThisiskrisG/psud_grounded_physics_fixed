# Storyboard: Car From A Funny House

## Story intent

Build the game from the ground up: start with a ground-level camera, a single funny house, one expressive car, and collisions that are readable enough for an AI observer to label and explain.

## Cast

- **Wobble House** — a crooked starter house with a garage that bends like rubber.
- **Peanut Rally Car** — a tiny car with oversized wheels and bounce-heavy suspension.
- **AI Lookout** — a ground-up observer that scans the scene from curb height and reports collision meaning.
- **Collision Props** — barrels, cones, crates, mailboxes, signs, and inflatable bumpers.

## Beat board

| Beat | Camera | Action | Physics collision | AI observation |
| --- | --- | --- | --- | --- |
| 01. Wake the house | Ground-level curb shot | Chimney puffs, garage eyes blink, driveway lights pulse. | Door bumps the car forward. | "Origin object detected: funny house garage." |
| 02. First roll | Follow cam behind tire | Car rolls out with a rubbery suspension wobble. | Tire taps a cone. | "Low-energy collision; cone displaced safely." |
| 03. Barrel surprise | Side dolly near asphalt | Car clips a barrel stack. | Barrels roll and transfer momentum. | "Chain reaction started; track rolling objects." |
| 04. Mailbox comedy | Low-angle front shot | Car swerves into a spring mailbox. | Mailbox bends, rebounds, nudges car. | "Elastic object returned stored force." |
| 05. Crate puzzle | Top/ground hybrid | Car pushes crates into a ramp-like shape. | Crates collide, stack, and create a path. | "Player-created structure can alter route." |
| 06. AI replay | Frozen orbit from street height | Scene rewinds as ghost trails show impacts. | Collision normals and impulses are drawn. | "Replay generated for learning and debugging." |
| 07. Launch gag | Hero ground shot | Car hits inflatable bumper and pops upward. | Bumper compresses and launches car. | "High impulse launch; recommend cinematic slow motion." |
| 08. Finish | Camera looks back to house | House waves roof shingles as car exits. | Final sign spins from a soft tap. | "Storyboard complete; save collision timeline." |

## Interaction priorities

1. **Readability first:** collisions must be exaggerated, colored, and slow enough to understand.
2. **AI-visible labels:** every object should expose a name, role, collision type, and current motion state.
3. **Ground-up camera:** the observer should feel near the road, not floating like a bird.
4. **Replay-ready events:** every collision beat should be serializable for future AI training or cinematic replay.

## Expansion prompts

- Add a steering challenge where the player routes the car through props in a funny-house neighborhood.
- Let the AI Lookout score collisions by safety, comedy, and usefulness.
- Generate replay cards: "what hit what," "why it moved," and "what the car should try next."
