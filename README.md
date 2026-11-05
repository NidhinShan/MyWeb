# Modern 3D Personal Portfolio

A sleek, responsive, interactive developer portfolio featuring a modern light-mode "Slate Stone & Burnt Ochre" earth-tone design system, a real-time WebGL / Three.js 3D Male Developer Avatar, elevated bento grid, automated direct messaging, dedicated hobbies showcase, and fluid micro-interactions.

## ✨ Highlights & Architecture

- **Slate Stone & Burnt Ochre Earth-Tone Design System (`static/css/style.css`)**:
  - Core design tokens: Limestone canvas (`--bg-base: #F9F9FA`), elevated white surface (`--bg-surface: #FFFFFF`), secondary container (`--bg-surface-subtle: #F1F2F4`), Raw Ochre (`--accent-primary: #B8833F`), Deep Ochre hover (`--accent-primary-hover: #9E6F33`), soft amber glow (`--accent-glow: rgba(184, 131, 63, 0.14)`), and muted slate blue (`--accent-secondary: #4E5D6C`).
  - High-contrast typography with Deep Graphite (`--text-primary: #1E2022`) and Muted Graphite (`--text-muted: #5A626A`). No harsh pure black `#000000` text or shadows.
  - Soft diffuse ambient occlusions (`--shadow-ambient: 0 10px 28px -6px rgba(30, 32, 34, 0.05), 0 2px 6px -1px rgba(30, 32, 34, 0.03)`).
  - Modern typography: Plus Jakarta Sans / Inter with tight letter-spacing (`-0.015em`) on titles, and JetBrains Mono / Fira Code for tags, metrics, and dates.

- **Fluid Micro-Interactions & Smooth Motion**:
  - **Cursor Spotlight Effect**: Dynamic radial gradient tracking cursor movements across project cards (`radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(184, 131, 63, 0.06), transparent 60%)`).
  - **Interactive Card Physics**: Gentle hover elevation with smooth `cubic-bezier(0.16, 1, 0.3, 1)` transition over 250ms, lifting cards by 4px with ochre borders and soft shadows.
  - **Button CTAs**: Primary solid Burnt Ochre with crisp white text and magnetic micro-lift; Secondary/Ghost in elevated surface with subtle borders elevating to amber glow.
  - **Tech Stack Pills**: Secondary surface subtle pills that flip into ochre/slate tint on hover.
  - **Page Transitions & Scroll Reveals**: Staggered entry with `opacity: 0 -> 1` and `translateY: 16px -> 0px`.

- **Interactive 3D Male Developer Avatar (`static/js/hero-3d.js`)**:
  - Procedurally rendered 3D stylized male developer avatar bust featuring chiseled facial features, warm skin tones, modern dark quiff hair, tech smart glasses, over-ear tech headphones, and a slate stone tech hoodie.
  - Floating illuminated developer terminal screen and gyroscopic orbital data nodes in ochre and slate tones.
  - **Dynamic Physics & Gaze Tracking**: The character's head and eyes smoothly turn to look directly at the cursor or touch position (`lerp` damping) with realistic angular constraints.
  - **Interactive Mode Switcher**: Dev Mode, Focus Mode, Soccer Play Mode, and Holographic HUD Cyber Mode.
  - **Zero Overhead**: Procedural Three.js geometry with clamped pixel ratio <= 2 and paused requestAnimationFrame via IntersectionObserver when offscreen.

- **Automated Direct Email Delivery (`static/js/main.js` & `templates/contact.html`)**:
  - Posts form submissions via FormSubmit AJAX without requiring a backend server.
  - Displays instant in-app status messages upon delivery, with direct one-click Gmail and mail app fallback buttons.

- **Beyond The Code · Hobbies & Passions Section (`index.html`, `data.js`, `templates/hobbies.html`)**:
  - Showcases multifaceted interests with interactive cards and category switcher:
    1. **Playing Football** (Turf matches, high-pressing play, and team leadership)
    2. **Movies & Web Series** (Sci-fi thrillers, nonlinear narratives, and binge series)
    3. **Reading Books** (Non-fiction, systems thinking, and tech biographies)
    4. **Browsing Geopolitics** (International relations, diplomacy, and global strategic shifts)

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
