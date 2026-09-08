# Heet Kalathiya — Portfolio

A fully responsive personal portfolio, built with plain HTML/CSS/JS (no
build step required) around a code-editor / terminal / data-notebook
visual theme — fitting for a React.js developer specializing in Data
Analytics & AI.

## File structure

```
index.html              all page content/markup
css/
  base.css              variables, reset, typography
  layout.css             sections, grids, structural positioning
  components.css        buttons, terminal widget, tags, cards, nav
  animations.css         keyframes + scroll-reveal transitions
  responsive.css         tablet/mobile breakpoints
js/
  particles.js            the animated node-network canvas background
  typewriter.js           rotating hero role text + terminal "boot" typing
  main.js                 nav behavior, scroll reveal, project card tilt
assets/
  video/, images/         empty — see "Adding a video background" below
```

## Running it locally

No build tools needed. Either:
- Open `index.html` directly in a browser, or
- Serve it (recommended, avoids any local file-permission quirks):
  ```
  cd portfolio
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Deploying

It's static, so any static host works: GitHub Pages, Netlify, Vercel,
Cloudflare Pages. For GitHub Pages: push this folder to a repo and
enable Pages on the `main` branch — no configuration needed.

## About the "video background"

You asked for a continuous video background. No video file was
uploaded with your resume, so the site ships with a **canvas-based
animated node network** (`js/particles.js`) as the continuous
background — it's dependency-free, loads instantly, and echoes the
"data/AI" theme.

If you'd rather use an actual video clip:
1. Add your file at `assets/video/hero.mp4` (and optionally a poster
   image at `assets/video/hero-poster.jpg`).
2. In `index.html`, uncomment the `<div class="hero-video-bg">` block
   near the top of the hero section.
3. Keep the video muted + short + compressed (a few MB, not tens) so
   it doesn't hurt load time or mobile data — autoplay also requires
   `muted` on iOS/Android or it will simply be blocked.

## Things worth double-checking before you publish

- **LinkedIn URL**: your resume only listed the display name "Heet
  kalathiya," not a profile URL, so `contact` section currently links
  to a guessed slug (`linkedin.com/in/heet-kalathiya`). Replace it in
  `index.html` (search for `linkedin.com`) with your real profile URL.
- **GitHub project links**: the "More on github.com/Heet1206" link
  points at your profile, since the resume didn't list per-project
  repo URLs. Link the FIT AI / Animal project cards directly to their
  repos once you have public links for them.
- **Resume PDF**: there's no "download résumé" button yet. If you want
  one, drop a PDF at e.g. `assets/HeetKalathiya_Resume.pdf` and add a
  link/button pointing to it in the hero or contact section.

## Customizing

- **Colors / fonts**: all defined once as CSS variables at the top of
  `css/base.css` (`--bg`, `--amber`, `--teal`, `--font-mono`, etc.) —
  change them there and they propagate everywhere.
- **Copy/content**: everything lives directly in `index.html`, grouped
  by section with HTML comments (`<!-- ============ HERO ============ -->`).
- **Motion**: the whole site respects `prefers-reduced-motion` — every
  animation (canvas background, typing effect, scroll reveals, card
  tilt) either simplifies or turns off for people with that setting.
