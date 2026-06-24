/* ============================================================================
   Salma & Abdo — Wedding invitation
   ----------------------------------------------------------------------------
   The invitation is one illustration. Clickable areas are invisible <a>
   "hotspots" over the printed labels (most are plain <a href> in the HTML).
   The few swap-later links live in CONFIG below. Decorative cutouts (.deco) are
   gently animated here — entrance fade/rise, slow idle float, light desktop
   parallax — all disabled under prefers-reduced-motion (they just show, static).
   ========================================================================== */

const CONFIG = {
  /* RSVP — Google Form. */
  RSVP_FORM_URL:
    "https://docs.google.com/forms/d/e/1FAIpQLSef71F5wLYwPeQkr6xCw_SCDiqTq40MNyB6Dgywk9qPtuJZPA/viewform?usp=dialog",

  /* Hotel "Special rate" links — the couple's negotiated booking URLs. */
  MARRIOTT_SPECIAL_RATE_URL:
    "https://app.marriott.com/resview2?id=1781436621616&key=GRP&app=resvlink",   /* Mena House */
  HYATT_SPECIAL_RATE_URL:
    "https://www.hyatt.com/events/en-US/group-booking/HBERC/G-SAA1",

  /* Venue map (confirmed: 9 Arena, Pyramids of Giza). */
  VENUE_MAP_URL:
    "https://www.google.com/maps/search/?api=1&query=9+Arena+Pyramids+of+Giza",
};

/* -------------------------------------------------------------------------- */

(function () {
  "use strict";

  function isUnset(url) {
    if (!url) return true;
    const v = String(url).trim();
    return v === "" || v === "#" || /[«»]/.test(v) || /GOOGLE_FORM_LINK/i.test(v);
  }

  /** Point a hotspot at a URL, or make it inert (and announce it) if unset. */
  function wireLink(el, url, pendingLabel) {
    if (!el) return;
    if (isUnset(url)) {
      el.setAttribute("aria-disabled", "true");
      el.removeAttribute("href");
      if (pendingLabel) {
        el.setAttribute("title", pendingLabel);
        el.setAttribute("aria-label", pendingLabel);
      }
      el.addEventListener("click", function (e) { e.preventDefault(); });
    } else {
      el.setAttribute("href", url);
    }
  }

  function wireLinks() {
    wireLink(document.querySelector('[data-map="venue"]'), CONFIG.VENUE_MAP_URL);
    wireLink(document.querySelector('[data-special-rate="marriott"]'),
             CONFIG.MARRIOTT_SPECIAL_RATE_URL, "Marriott special rate — link coming soon");
    wireLink(document.querySelector('[data-special-rate="hyatt"]'),
             CONFIG.HYATT_SPECIAL_RATE_URL, "Hyatt special rate — link coming soon");
    wireLink(document.querySelector("[data-rsvp]"),
             CONFIG.RSVP_FORM_URL, "RSVP — link coming soon");
  }

  /* ?debug=1 → tint the hotspots so they can be re-aligned to the artwork. */
  function initDebug() {
    if (/[?&]debug=1\b/.test(location.search)) {
      const layer = document.querySelector(".hotspots");
      if (layer) layer.classList.add("is-debug");
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Animate the decorative cutouts. No-op (they stay visible & static) when the
     user prefers reduced motion or IntersectionObserver is unavailable. */
  function initDeco() {
    const decos = Array.prototype.slice.call(document.querySelectorAll(".deco"));
    if (!decos.length) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    document.body.classList.add("deco-anim");

    // Pause the idle float while a piece is off-screen.
    const idle = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("is-paused", !e.isIntersecting);
      });
    }, { rootMargin: "120px 0px 120px 0px" });

    // Soft entrance, once per piece, then hand off to the idle float.
    const enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        enter.unobserve(el);
        window.setTimeout(function () {        // after the entrance transition
          el.style.willChange = "auto";
          el.classList.add("is-idle");
          idle.observe(el);
        }, 2000);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    decos.forEach(function (el) { enter.observe(el); });

    initParallax(decos);
  }

  /* Gentle parallax for a few large pieces — desktop / fine-pointer only. */
  function initParallax(decos) {
    const mm = window.matchMedia;
    if (mm && (mm("(pointer: coarse)").matches || mm("(max-width: 560px)").matches)) return;
    const items = decos.filter(function (el) { return el.classList.contains("is-parallax"); });
    if (!items.length) return;

    let ticking = false;
    function update() {
      ticking = false;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (el) {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh;        // ~ -0.5 .. 0.5
        const py = Math.max(-18, Math.min(18, off * -26));        // gentle, clamped
        el.style.setProperty("--py", py.toFixed(1) + "px");
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireLinks();
    initDebug();
    initDeco();
  });
})();
