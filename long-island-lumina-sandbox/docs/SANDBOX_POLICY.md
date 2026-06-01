# Sandbox Policy

The game is designed to run safely as a browser-only itch.io prototype.

## Launcher sandbox

`src/sandbox.html` loads `game.html` with this iframe policy:

```html
sandbox="allow-scripts allow-pointer-lock"
```

This means the game may execute local JavaScript and request pointer-lock style input, but it does not receive same-origin privileges from the launcher and does not get form submission, popups, downloads, camera, microphone, or location permissions.

## Runtime restrictions

The game intentionally avoids:

- Network requests.
- Cookies and account logins.
- Local storage persistence.
- Device location.
- Camera or microphone access.
- Real map overlays or real municipal/security data.

## Content boundary

The Long Island theme is fictional and scenic. The prototype uses stylized suburbs, boardwalks, rail platforms, harbor lights, and civic plazas to show talent, staging, lighting, and environment mood. It is not a representation of real infrastructure or operational planning.

## Itch.io guidance

When uploading to itch.io:

1. Zip the `dist/` folder contents, not the folder itself.
2. Set the project type to **HTML**.
3. Use `index.html` as the launch file.
4. Keep fullscreen enabled for the strongest lighting/staging effect.
