/* ============================================================================
   Salma & Abdo — Wedding invitation
   ----------------------------------------------------------------------------
   The invitation is one illustration; the clickable areas are invisible <a>
   "hotspots" over the printed labels. Most hotspots are plain <a href> in the
   HTML. The few swap-later links live in CONFIG below — paste a real URL and it
   goes live; left unset, that hotspot is inert (the printed button still shows,
   but nothing happens until you add the URL).
   ========================================================================== */

const CONFIG = {
  /* RSVP — paste the Google Form link here. */
  RSVP_FORM_URL: "«GOOGLE_FORM_LINK»",

  /* Hotel "Special rate" links — the couple's negotiated booking URLs. */
  MARRIOTT_SPECIAL_RATE_URL: "#",
  HYATT_SPECIAL_RATE_URL: "#",

  /* Venue map (confirmed: 9 Pyramids Lounge, Giza). */
  VENUE_MAP_URL:
    "https://www.google.com/maps/search/?api=1&query=9+Pyramids+Lounge+Giza",
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

  document.addEventListener("DOMContentLoaded", function () {
    wireLink(document.querySelector('[data-map="venue"]'), CONFIG.VENUE_MAP_URL);
    wireLink(document.querySelector('[data-special-rate="marriott"]'),
             CONFIG.MARRIOTT_SPECIAL_RATE_URL, "Marriott special rate — link coming soon");
    wireLink(document.querySelector('[data-special-rate="hyatt"]'),
             CONFIG.HYATT_SPECIAL_RATE_URL, "Hyatt special rate — link coming soon");
    wireLink(document.querySelector("[data-rsvp]"),
             CONFIG.RSVP_FORM_URL, "RSVP — link coming soon");

    /* ?debug=1 → tint the hotspots so they can be re-aligned to the artwork. */
    if (/[?&]debug=1\b/.test(location.search)) {
      const layer = document.querySelector(".hotspots");
      if (layer) layer.classList.add("is-debug");
    }
  });
})();
