/* ============================================================================
   Salma & Abdo — Wedding invitation
   ----------------------------------------------------------------------------
   The invitation is one illustration with all text and decoration baked in.
   Clickable areas are invisible <a> "hotspots" over the printed labels (most are
   plain <a href> in the HTML). The few swap-later links live in CONFIG below.
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

  /* Venue map — 9 Pyramids Lounge (Google Maps link). */
  VENUE_MAP_URL:
    "https://maps.app.goo.gl/gfRGdi3uq9RM86dy7?g_st=iw",
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

  document.addEventListener("DOMContentLoaded", function () {
    wireLinks();
    initDebug();
  });
})();
