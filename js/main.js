/* ============================================
   main.js
   Nav behavior, scroll-driven reveals, active link
   tracking, and the project-card tilt/glow effect.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav: background on scroll ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  document.body.appendChild(scrim);

  function closeMenu() {
    navToggle?.setAttribute("aria-expanded", "false");
    navLinks?.classList.remove("open");
    scrim.classList.remove("open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    navToggle?.setAttribute("aria-expanded", "true");
    navLinks?.classList.add("open");
    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });
  scrim.addEventListener("click", closeMenu);
  navLinks
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll("[data-nav]");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spyObserver.observe(s));

  /* ---------- scroll reveal ---------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- project card tilt + glow ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const maxTilt = 6; // degrees, kept subtle

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
});
