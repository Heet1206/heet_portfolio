/* ============================================
   particles.js
   Continuous animated background: a drifting node
   network, standing in for the "data" in Data & AI.
   Runs on <canvas id="bg-canvas">.
   ============================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width, height, dpr;
  let nodes = [];
  let mouse = { x: null, y: null, active: false };
  let rafId = null;

  const COLORS = ["#f5b942", "#33d6c0", "#9c8cf5"];
  const LINK_DIST = 150;
  const MOUSE_DIST = 170;

  function nodeCountForViewport() {
    const area = width * height;
    // fewer nodes on small / low-power screens
    const base = Math.round(area / 24000);
    return Math.max(28, Math.min(base, 110));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedNodes();
  }

  function seedNodes() {
    const count = nodeCountForViewport();
    nodes = new Array(count).fill(null).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          n.x += (dx / dist) * force * 0.6;
          n.y += (dy / dist) * force * 0.6;
        }
      }
    }

    // links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(154, 165, 189, ${
            0.14 * (1 - dist / LINK_DIST)
          })`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.fillStyle = n.color;
      ctx.globalAlpha = 0.85;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(step);
  }

  function drawStaticFrame() {
    // reduced-motion fallback: a single calm static frame, no rAF loop
    ctx.clearRect(0, 0, width, height);
    for (const n of nodes) {
      ctx.beginPath();
      ctx.fillStyle = n.color;
      ctx.globalAlpha = 0.5;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  window.addEventListener("resize", () => {
    resize();
    if (prefersReducedMotion) drawStaticFrame();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  resize();

  if (prefersReducedMotion) {
    drawStaticFrame();
  } else {
    step();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !prefersReducedMotion && !rafId) {
      step();
    }
  });
})();
