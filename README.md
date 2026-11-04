# Modern 3D Personal Portfolio

A sleek, responsive, interactive dark-themed developer portfolio featuring a real-time WebGL / Three.js 3D Male Developer Avatar, glassmorphism bento grid, automated direct messaging, dedicated hobbies showcase, and high-performance micro-interactions.

## ✨ Highlights & Architecture

- **Interactive 3D Male Developer Avatar (`static/js/hero-3d.js`)**:
  - Procedurally rendered 3D stylized male developer avatar bust featuring chiseled facial features, warm skin tones, modern dark quiff hair, tech smart glasses, over-ear tech headphones, and a dark slate tech hoodie.
  - Floating illuminated developer terminal screen and gyroscopic orbital data nodes.
  - **Dynamic Physics & Gaze Tracking**: The character's head and eyes smoothly turn to look directly at the cursor or touch position (`lerp` damping) with realistic angular constraints.
  - **Natural Idle & Interactivity**: Harmonic breathing levitation, glasses glint, orbital rotation, and an enthusiastic greeting nod when clicked or tapped.
  - **Zero Overhead**: Completely procedural in Three.js (zero external 3D model downloads, no 404/CORS issues, instant load).
  - **Optimization**: `devicePixelRatio` clamped to `Math.min(window.devicePixelRatio, 2)`, no post-processing bloat, and `requestAnimationFrame` paused automatically via `IntersectionObserver` when scrolled off-screen.

- **Automated Direct Email Delivery (`static/js/main.js` & `templates/contact.html`)**:
  - Resolved previous email dispatch limitations where `mailto:` required an OS mail client.
  - Directly posts form submissions via `fetch` to FormSubmit AJAX (`https://formsubmit.co/ajax/your-email`), routing messages straight to your inbox without requiring a backend server.
  - Displays instant in-app status messages upon delivery, with direct one-click Gmail and mail app fallback buttons if offline.

- **Beyond The Code · Hobbies & Passions Section (`index.html`, `data.js`, `style.css`)**:
  - Showcases multifaceted interests with interactive glassmorphism cards and hover micro-animations:
    1. **Playing Football** (Turf matches, high-pressing play, and team leadership)
    2. **Movies & Web Series** (Sci-fi thrillers, nonlinear narratives, and binge series)
    3. **Reading Books** (Non-fiction, systems thinking, and tech biographies)
    4. **Browsing Geopolitics** (International relations, diplomacy, and global strategic shifts)

- **Cyber Dark Palette & Atmosphere (`static/css/style.css`)**:
  - Deep obsidian base (`#07090e`) with multi-point radial mesh glow accents (Electric Cyan `#00f0ff`, Neon Violet `#a855f7`, Electric Blue `#38bdf8`).
  - Google Fonts (`Inter` for copy, `Fira Code` for badges and metadata).
  - Glassmorphic bento cards with 3D cursor tilt, spotlights, and magnetic button pull.

## 📁 Project Structure

```
portfolio/
├── index.html                 # Hero showcase with 3D Canvas, Bento grid & Hobbies
├── README.md
├── static/
│   ├── css/
│   │   └── style.css          # Design system, glassmorphism, responsive styles
│   └── js/
│       ├── data.js            # Profile, stats, projects, hobbies, roles & timeline
│       ├── hero-3d.js         # Three.js 3D Male Developer Avatar & WebGL engine
│       └── main.js            # UI layout, bento rendering, direct email dispatch
└── templates/
    ├── contact.html           # Glassmorphic contact form & direct reach links
    ├── roles.html             # Campus governance & leadership showcase
    └── timeline.html          # Constellation milestone matrix
```

## 🚀 Running Locally

1. Open the project folder in VS Code or your preferred editor.
2. Launch with the **Live Server** extension or any local static HTTP server (e.g., `npx serve`, `python -m http.server`, etc.).
3. Edit `static/js/data.js` to update bio, hobbies, projects, stats, or timeline milestones.
