/* ============================================
   typewriter.js
   Drives the rotating role text in the hero, and
   types out the boot sequence inside the terminal card.
   ============================================ */

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- rotating role text ---------- */
  const roles = [
    "React.js Frontend Developer",
    "Data Analytics & AI Student",
    "Generative AI Tinkerer",
    "Full-stack Builder",
  ];

  const typedEl = document.getElementById("typed-text");

  function typeLoop() {
    if (!typedEl) return;

    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          return setTimeout(tick, 400);
        }
      }

      setTimeout(tick, deleting ? 35 : 60);
    }

    tick();
  }

  /* ---------- terminal boot sequence ---------- */
  const terminalLines = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "Heet Kalathiya — frontend dev & data/AI enthusiast" },
    { type: "cmd", text: "cat focus.txt" },
    { type: "out", text: "React.js interfaces + data-driven, AI-assisted features" },
    { type: "cmd", text: "status --current" },
    { type: "out", text: "Open to internships & frontend / data-AI roles ✓" },
  ];

  const terminalBody = document.getElementById("terminal-body");

  function renderTerminalInstant() {
    if (!terminalBody) return;
    terminalBody.innerHTML = terminalLines
      .map((line) =>
        line.type === "cmd"
          ? `<p><span class="prompt">$</span>${line.text}</p>`
          : `<p class="out-line">${line.text}</p>`
      )
      .join("");
  }

  function typeTerminal() {
    if (!terminalBody) return;

    if (prefersReducedMotion) {
      renderTerminalInstant();
      return;
    }

    let lineIndex = 0;

    function nextLine() {
      if (lineIndex >= terminalLines.length) return;
      const line = terminalLines[lineIndex];
      const p = document.createElement("p");

      if (line.type === "cmd") {
        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "$";
        p.appendChild(prompt);
      } else {
        p.classList.add("out-line");
      }

      terminalBody.appendChild(p);

      let charIndex = 0;
      const textNode = document.createTextNode("");
      p.appendChild(textNode);

      function typeChar() {
        charIndex++;
        textNode.textContent = line.text.slice(0, charIndex);
        if (charIndex < line.text.length) {
          setTimeout(typeChar, line.type === "cmd" ? 38 : 14);
        } else {
          lineIndex++;
          setTimeout(nextLine, line.type === "cmd" ? 220 : 420);
        }
      }
      typeChar();
    }

    nextLine();
  }

  /* kick both off once the hero is in view (or immediately — hero is above the fold) */
  document.addEventListener("DOMContentLoaded", () => {
    typeLoop();
    typeTerminal();
  });
})();
