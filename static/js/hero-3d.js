/**
 * hero-3d.js · Interactive 3D Male Developer Avatar
 * 
 * Features:
 * - Stylized 3D male developer avatar bust (human head, modern quiff hair, smart glasses, tech hoodie)
 * - Real-time 3D Orbit Dragging with momentum, inertia, and spring-back to cursor gaze
 * - Dynamic Interactive Mode Switcher:
 *   * [👨‍💻 Dev Mode]: Default state with floating code terminal & ambient particles
 *   * [🎧 Focus Mode]: Headphones slide up over ears with glowing cyan LED pulses
 *   * [⚽ Play Mode]: 3D low-poly soccer ball materializes and bounces in 3D orbit
 *   * [⚡ Cyber Mode]: Holographic HUD scanline & radiant visor glow
 * - Cursor gaze tracking with damped lerping
 * - Double-click 360 spin impulse with particle burst
 * - IntersectionObserver pausing & clamped pixel ratio <= 2
 * - WebGL support detection and graceful CSS fallback
 */

(function () {
  'use strict';

  function isWebGLSupported() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  const container = document.getElementById('hero-3d-wrap');
  const canvas = document.getElementById('hero-3d-canvas');
  const fallback = document.getElementById('hero-3d-fallback');

  if (!container || !canvas) return;

  if (typeof THREE === 'undefined' || !isWebGLSupported()) {
    if (fallback) fallback.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    return;
  }

  // 1. Scene, Camera & Renderer
  const scene = new THREE.Scene();

  const initialWidth = container.clientWidth || 400;
  const initialHeight = container.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(
    38,
    initialWidth / initialHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.15, 4.8);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    if (fallback) fallback.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    return;
  }

  renderer.setSize(initialWidth, initialHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // 2. Lighting Setup (Slate Stone & Burnt Ochre Earth-Tone Architecture)
  const ambientLight = new THREE.AmbientLight(0xe8edf2, 1.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.0);
  keyLight.position.set(3, 3, 4);
  scene.add(keyLight);

  const ochreRim = new THREE.DirectionalLight(0xb8833f, 2.5);
  ochreRim.position.set(-3.5, 2.5, -2);
  scene.add(ochreRim);

  const slateRim = new THREE.DirectionalLight(0x4e5d6c, 2.0);
  slateRim.position.set(3.5, -1.5, -2);
  scene.add(slateRim);

  const fillLight = new THREE.PointLight(0xd4974c, 1.2, 8);
  fillLight.position.set(0, -2, 2.5);
  scene.add(fillLight);

  // 3. Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd49575,
    roughness: 0.65,
    metalness: 0.05,
    flatShading: true
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1e2022,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: true
  });

  const hoodieMat = new THREE.MeshStandardMaterial({
    color: 0x3d4752, // Slate stone tech hoodie
    roughness: 0.72,
    metalness: 0.12,
    flatShading: true
  });

  const neonOchreMat = new THREE.MeshBasicMaterial({ color: 0xb8833f });
  const neonSlateMat = new THREE.MeshBasicMaterial({ color: 0x4e5d6c });

  // 4. Character Master Group
  const avatarGroup = new THREE.Group();
  scene.add(avatarGroup);

  // --- Torso & Tech Hoodie ---
  const torsoGroup = new THREE.Group();
  avatarGroup.add(torsoGroup);

  const chestGeo = new THREE.CylinderGeometry(0.85, 1.15, 1.3, 8);
  const chest = new THREE.Mesh(chestGeo, hoodieMat);
  chest.position.set(0, -1.35, 0);
  torsoGroup.add(chest);

  const innerShirt = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.8 }));
  innerShirt.position.set(0, -0.72, 0.08);
  torsoGroup.add(innerShirt);

  const zip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.95, 0.04), neonOchreMat);
  zip.position.set(0, -1.25, 0.88);
  torsoGroup.add(zip);

  const leftSeam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.35), neonSlateMat);
  leftSeam.position.set(-0.75, -0.92, 0);
  leftSeam.rotation.z = -0.25;
  torsoGroup.add(leftSeam);

  const rightSeam = leftSeam.clone();
  rightSeam.position.set(0.75, -0.92, 0);
  rightSeam.rotation.z = 0.25;
  torsoGroup.add(rightSeam);

  // --- Over-Ear Tech Headphones (Can slide up to ears!) ---
  const hpGroup = new THREE.Group();
  hpGroup.position.set(0, -0.65, 0.05);
  torsoGroup.add(hpGroup);

  const hpBandGeo = new THREE.TorusGeometry(0.52, 0.045, 8, 24, Math.PI * 0.9);
  const hpBandMat = new THREE.MeshStandardMaterial({ color: 0x1e242d, metalness: 0.8, roughness: 0.3 });
  const hpBand = new THREE.Mesh(hpBandGeo, hpBandMat);
  hpBand.rotation.x = Math.PI / 2 + 0.3;
  hpBand.position.set(0, 0, -0.1);
  hpGroup.add(hpBand);

  const cushionMat = new THREE.MeshStandardMaterial({ color: 0x343e4a, metalness: 0.5, roughness: 0.5 });
  const leftCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), cushionMat);
  leftCushion.rotation.z = Math.PI / 2;
  leftCushion.position.set(-0.52, 0.05, 0.08);
  hpGroup.add(leftCushion);

  const leftLedRing = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.13, 16), neonOchreMat);
  leftLedRing.rotation.y = -Math.PI / 2;
  leftLedRing.position.set(-0.59, 0.05, 0.08);
  hpGroup.add(leftLedRing);

  const rightCushion = leftCushion.clone();
  rightCushion.position.set(0.52, 0.05, 0.08);
  hpGroup.add(rightCushion);

  const rightLedRing = leftLedRing.clone();
  rightLedRing.rotation.y = Math.PI / 2;
  rightLedRing.position.set(0.59, 0.05, 0.08);
  hpGroup.add(rightLedRing);

  // --- Head & Facial Features ---
  const headGroup = new THREE.Group();
  avatarGroup.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.45, 8), skinMat);
  neck.position.set(0, -0.5, 0);
  headGroup.add(neck);

  const headMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.85, 8), skinMat);
  headMesh.position.set(0, 0.05, 0);
  headGroup.add(headMesh);

  const chin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.3), skinMat);
  chin.position.set(0, -0.32, 0.22);
  headGroup.add(chin);

  const leftEar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.14), skinMat);
  leftEar.position.set(-0.52, 0.05, 0);
  headGroup.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.set(0.52, 0.05, 0);
  headGroup.add(rightEar);

  // Stylized Hair (Quiff)
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.35, 1.05), hairMat);
  hairTop.position.set(0, 0.48, -0.05);
  hairTop.rotation.x = -0.08;
  hairGroup.add(hairTop);

  const quiff = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.35, 4), hairMat);
  quiff.rotation.x = Math.PI / 2 + 0.35;
  quiff.rotation.z = 0.2;
  quiff.position.set(-0.05, 0.52, 0.42);
  hairGroup.add(quiff);

  const quiff2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.3, 4), hairMat);
  quiff2.rotation.x = Math.PI / 2 + 0.45;
  quiff2.rotation.z = -0.25;
  quiff2.position.set(0.18, 0.48, 0.4);
  hairGroup.add(quiff2);

  const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.55, 0.45), hairMat);
  hairBack.position.set(0, 0.2, -0.42);
  hairGroup.add(hairBack);

  // Eyebrows & Eyes
  const browMat = new THREE.MeshBasicMaterial({ color: 0x111625 });
  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), browMat);
  leftBrow.position.set(-0.2, 0.18, 0.49);
  leftBrow.rotation.z = 0.12;
  headGroup.add(leftBrow);

  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), browMat);
  rightBrow.position.set(0.2, 0.18, 0.49);
  rightBrow.rotation.z = -0.12;
  headGroup.add(rightBrow);

  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });

  const leftEyeWhite = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.05), eyeWhiteMat);
  leftEyeWhite.position.set(-0.2, 0.08, 0.48);
  headGroup.add(leftEyeWhite);

  const leftPupil = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), pupilMat);
  leftPupil.position.set(-0.2, 0.08, 0.49);
  headGroup.add(leftPupil);

  const rightEyeWhite = leftEyeWhite.clone();
  rightEyeWhite.position.set(0.2, 0.08, 0.48);
  headGroup.add(rightEyeWhite);

  const rightPupil = leftPupil.clone();
  rightPupil.position.set(0.2, 0.08, 0.49);
  headGroup.add(rightPupil);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 4), skinMat);
  nose.position.set(0, 0.02, 0.54);
  nose.rotation.x = 0.2;
  headGroup.add(nose);

  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.05), new THREE.MeshBasicMaterial({ color: 0xa85d50 }));
  mouth.position.set(0, -0.16, 0.49);
  headGroup.add(mouth);

  // Developer Smart Glasses
  const glassesGroup = new THREE.Group();
  headGroup.add(glassesGroup);

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e2022, metalness: 0.8, roughness: 0.25 });
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xb8833f, transparent: true, opacity: 0.25, roughness: 0.1, transmission: 0.7, thickness: 0.1 });

  const leftFrame = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 6, 20), frameMat);
  leftFrame.position.set(-0.2, 0.08, 0.55);
  glassesGroup.add(leftFrame);

  const leftLens = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), lensMat);
  leftLens.position.set(-0.2, 0.08, 0.55);
  glassesGroup.add(leftLens);

  const rightFrame = leftFrame.clone();
  rightFrame.position.set(0.2, 0.08, 0.55);
  glassesGroup.add(rightFrame);

  const rightLens = leftLens.clone();
  rightLens.position.set(0.2, 0.08, 0.55);
  glassesGroup.add(rightLens);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.03), frameMat);
  bridge.position.set(0, 0.1, 0.55);
  glassesGroup.add(bridge);

  const armGeo = new THREE.BoxGeometry(0.02, 0.02, 0.55);
  const leftArm = new THREE.Mesh(armGeo, frameMat);
  leftArm.position.set(-0.35, 0.08, 0.3);
  glassesGroup.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.set(0.35, 0.08, 0.3);
  glassesGroup.add(rightArm);

  // Holographic Cyber HUD Visor (Visible in Cyber Mode)
  const cyberHudGroup = new THREE.Group();
  glassesGroup.add(cyberHudGroup);
  cyberHudGroup.visible = false;

  const hudRing = new THREE.Mesh(
    new THREE.RingGeometry(0.45, 0.48, 32),
    new THREE.MeshBasicMaterial({ color: 0xb8833f, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  hudRing.position.set(0, 0.08, 0.62);
  cyberHudGroup.add(hudRing);

  const hudCross = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.015, 0.01),
    new THREE.MeshBasicMaterial({ color: 0xb8833f, transparent: true, opacity: 0.85 })
  );
  hudCross.position.set(0, 0.08, 0.63);
  cyberHudGroup.add(hudCross);

  // --- Floating Developer Terminal Screen ---
  const tabletGroup = new THREE.Group();
  tabletGroup.position.set(0, -0.9, 0.85);
  tabletGroup.rotation.x = -Math.PI / 4.8;
  avatarGroup.add(tabletGroup);

  const screenBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.72, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1e2022, metalness: 0.7, roughness: 0.3 })
  );
  tabletGroup.add(screenBody);

  const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.64), new THREE.MeshBasicMaterial({ color: 0x15181c }));
  screenFace.position.set(0, 0, 0.025);
  tabletGroup.add(screenFace);

  const codeColors = [0xb8833f, 0x4e5d6c, 0x9e6f33, 0xd4974c, 0x5a626a];
  const codeWidths = [0.45, 0.75, 0.6, 0.85, 0.4];
  const codeX = [-0.28, -0.12, -0.2, -0.08, -0.3];
  const codeY = [0.18, 0.08, -0.02, -0.12, -0.22];

  for (let i = 0; i < 5; i++) {
    const lineMesh = new THREE.Mesh(
      new THREE.BoxGeometry(codeWidths[i], 0.035, 0.01),
      new THREE.MeshBasicMaterial({ color: codeColors[i] })
    );
    lineMesh.position.set(codeX[i], codeY[i], 0.035);
    tabletGroup.add(lineMesh);
  }

  // --- 3D Low-Poly Soccer Ball (Play Mode) ---
  const soccerBallGroup = new THREE.Group();
  soccerBallGroup.position.set(1.2, 0.2, 0.4);
  soccerBallGroup.scale.set(0, 0, 0); // Initially hidden
  avatarGroup.add(soccerBallGroup);

  const ballGeo = new THREE.IcosahedronGeometry(0.26, 1);
  const ballMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.45,
    metalness: 0.1,
    flatShading: true
  });
  const ballMesh = new THREE.Mesh(ballGeo, ballMat);
  soccerBallGroup.add(ballMesh);

  // Ball Neon Rings
  const ballRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.012, 8, 24),
    neonOchreMat
  );
  soccerBallGroup.add(ballRing);

  // Orbital Gyroscopic Ring
  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.7, 0.014, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0xb8833f, transparent: true, opacity: 0.4 })
  );
  orbitRing.rotation.x = Math.PI / 3;
  orbitRing.rotation.y = Math.PI / 6;
  avatarGroup.add(orbitRing);

  // Satellites
  const satGroup = new THREE.Group();
  avatarGroup.add(satGroup);
  const satGeo = new THREE.OctahedronGeometry(0.08, 0);
  const satMat = new THREE.MeshBasicMaterial({ color: 0xb8833f });
  const satellites = [];

  for (let i = 0; i < 3; i++) {
    const sat = new THREE.Mesh(satGeo, satMat);
    satGroup.add(sat);
    satellites.push({
      mesh: sat,
      orbitRadius: 1.7,
      speed: 0.8 + i * 0.3,
      angle: (i * Math.PI * 2) / 3,
      axisY: 0.35 * (i % 2 === 0 ? 1 : -1)
    });
  }

  // Ambient Particles
  const particleCount = 110;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 1.8 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    particlePositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  function createDotTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(184, 131, 63, 0.9)');
    grad.addColorStop(0.35, 'rgba(78, 93, 108, 0.45)');
    grad.addColorStop(1, 'rgba(249, 249, 250, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(pCanvas);
  }

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    map: createDotTexture(),
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  avatarGroup.position.set(0, 0.1, 0);

  // ==========================================
  // 5. Interactive Mode Switcher State
  // ==========================================
  let currentMode = 'normal'; // 'normal' | 'focus' | 'football' | 'cyber'

  function setAvatarMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.avatar-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    if (mode === 'cyber') {
      cyberHudGroup.visible = true;
    } else {
      cyberHudGroup.visible = false;
    }
  }

  // Create Interactive Toolbar overlay if not present
  function setupAvatarControls() {
    let bar = container.querySelector('.avatar-mode-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'avatar-mode-bar';
      bar.innerHTML = `
        <button class="avatar-btn active" data-mode="normal" title="Normal Dev Mode">👨‍💻 Dev</button>
        <button class="avatar-btn" data-mode="focus" title="Put on Headphones to Focus">🎧 Focus</button>
        <button class="avatar-btn" data-mode="football" title="Summon 3D Soccer Ball">⚽ Play</button>
        <button class="avatar-btn" data-mode="cyber" title="Activate Hologram HUD">⚡ Cyber</button>
      `;
      container.appendChild(bar);

      bar.addEventListener('click', (e) => {
        const btn = e.target.closest('.avatar-btn');
        if (btn && btn.dataset.mode) {
          e.stopPropagation();
          setAvatarMode(btn.dataset.mode);
        }
      });
    }
  }

  setupAvatarControls();

  // ==========================================
  // 6. Real-time 3D Drag-To-Orbit & Gaze Physics
  // ==========================================
  const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let orbitYaw = 0;
  let orbitPitch = 0;
  let orbitVelocityX = 0;
  let orbitVelocityY = 0;
  let idleTime = 0;
  let spinImpulse = 0;

  function onPointerDown(e) {
    if (e.target.closest('.avatar-mode-bar') || e.target.closest('.canvas-badge')) return;
    isDragging = true;
    idleTime = 0;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    dragStartX = clientX;
    dragStartY = clientY;
    orbitVelocityX = 0;
    orbitVelocityY = 0;
    container.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (clientX === undefined) return;

    if (isDragging) {
      const deltaX = clientX - dragStartX;
      const deltaY = clientY - dragStartY;
      dragStartX = clientX;
      dragStartY = clientY;

      orbitVelocityX = deltaX * 0.009;
      orbitVelocityY = deltaY * 0.006;

      orbitYaw += orbitVelocityX;
      orbitPitch = Math.max(-0.6, Math.min(0.6, orbitPitch + orbitVelocityY));
      idleTime = 0;
    } else {
      const rect = container.getBoundingClientRect();
      const x = (clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
      pointer.targetX = Math.max(-1.1, Math.min(1.1, x));
      pointer.targetY = Math.max(-1.1, Math.min(1.1, y));
    }
  }

  function onPointerUp() {
    isDragging = false;
    container.style.cursor = 'grab';
  }

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Double Click 360 Spin Action
  container.addEventListener('dblclick', () => {
    spinImpulse = 0.55;
  });

  // ==========================================
  // 7. Viewport Intersection & Resizing
  // ==========================================
  let isVisible = true;
  let rafId = null;
  const clock = new THREE.Clock();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          clock.start();
          animate();
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(container);

  function handleResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w <= 0 || h <= 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('load', handleResize);
  setTimeout(handleResize, 100);

  // ==========================================
  // 8. Main Render & Physics Animation Loop
  // ==========================================
  function animate() {
    if (!isVisible) return;

    rafId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Damped cursor gaze interpolation
    const lerpRate = 0.055;
    pointer.currentX += (pointer.targetX - pointer.currentX) * lerpRate;
    pointer.currentY += (pointer.targetY - pointer.currentY) * lerpRate;

    // Orbit Drag Momentum & Friction
    if (!isDragging) {
      orbitYaw += orbitVelocityX;
      orbitPitch += orbitVelocityY;
      orbitVelocityX *= 0.93;
      orbitVelocityY *= 0.93;

      idleTime += delta;
      // Spring back toward cursor gaze after 2.5 seconds of no dragging
      if (idleTime > 2.5) {
        orbitYaw *= 0.96;
        orbitPitch *= 0.96;
      }
    }

    // Spin impulse decay
    spinImpulse *= 0.94;

    // Idle breathing & floating
    const breathingOffset = Math.sin(elapsedTime * 1.8) * 0.08;
    avatarGroup.position.y = 0.1 + breathingOffset;

    // Master Avatar 3D Yaw & Pitch from user dragging
    avatarGroup.rotation.y = orbitYaw + spinImpulse * 6.28;
    avatarGroup.rotation.x = orbitPitch;

    // Head Gaze Tracking: responds to pointer
    headGroup.rotation.y = pointer.currentX * 0.55;
    headGroup.rotation.x = -pointer.currentY * 0.35;
    headGroup.rotation.z = -pointer.currentX * 0.08;

    torsoGroup.rotation.y = pointer.currentX * 0.22;
    torsoGroup.rotation.x = -pointer.currentY * 0.12;

    // --- Mode-Specific Animations ---
    // 1. Focus Mode: Headphones slide up smoothly to ears!
    const targetHpY = currentMode === 'focus' ? 0.05 : -0.65;
    const targetHpRotX = currentMode === 'focus' ? 0 : Math.PI / 2 + 0.3;
    hpGroup.position.y += (targetHpY - hpGroup.position.y) * 0.08;
    hpGroup.rotation.x += (targetHpRotX - hpGroup.rotation.x) * 0.08;

    // 2. Play Mode: 3D Soccer Ball appears, bounces & orbits
    const targetBallScale = currentMode === 'football' ? 1 : 0;
    soccerBallGroup.scale.lerp(new THREE.Vector3(targetBallScale, targetBallScale, targetBallScale), 0.08);

    if (currentMode === 'football') {
      soccerBallGroup.position.x = 1.15 + Math.sin(elapsedTime * 2.5) * 0.15;
      soccerBallGroup.position.y = 0.15 + Math.abs(Math.sin(elapsedTime * 3.5)) * 0.35;
      ballMesh.rotation.x += 0.04;
      ballMesh.rotation.y += 0.05;
      ballRing.rotation.z += 0.03;
    }

    // 3. Cyber Mode: HUD radar rotation
    if (currentMode === 'cyber') {
      hudRing.rotation.z += 0.02;
      hudCross.rotation.z -= 0.03;
      lensMat.opacity = 0.6 + Math.sin(elapsedTime * 4.0) * 0.2;
    } else {
      lensMat.opacity = 0.32 + Math.sin(elapsedTime * 2.5) * 0.12;
    }

    // Floating tablet tilt & gentle float
    tabletGroup.position.y = -0.9 + Math.sin(elapsedTime * 2.2) * 0.03;
    tabletGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04 - pointer.currentX * 0.1;

    // Orbital ring
    orbitRing.rotation.z += 0.006;
    orbitRing.rotation.y += 0.004;

    // Satellites orbiting
    satellites.forEach((sat) => {
      sat.angle += delta * sat.speed;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
      sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
      sat.mesh.position.y = Math.sin(sat.angle * 2.0) * sat.axisY;
      sat.mesh.rotation.x += 0.03;
      sat.mesh.rotation.y += 0.04;
    });

    // Ambient constellation
    particles.rotation.y = elapsedTime * 0.03;

    renderer.render(scene, camera);
  }

  animate();
})();
