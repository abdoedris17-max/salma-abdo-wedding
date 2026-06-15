/* ============================================================================
   Salma & Abdo — Wedding invitation
   ----------------------------------------------------------------------------
   Everything you may need to swap later lives in CONFIG below — mostly one-line
   changes. Anything left as a placeholder ("#", empty, or the «…» token) renders
   as a clearly-marked, non-clickable pill so the site never ships a dead link.
   ========================================================================== */

const CONFIG = {
  /* 1) RSVP — paste the Google Form link here (then it just works). */
  RSVP_FORM_URL: "«GOOGLE_FORM_LINK»",

  /* 2) Hotel "Special rate" links — the couple's negotiated booking URLs.
        Leave as "#" until you have them; they render as "coming soon". */
  MARRIOTT_SPECIAL_RATE_URL: "#",
  HYATT_SPECIAL_RATE_URL: "#",

  /* Venue map (confirmed: 9 Pyramids Lounge, Giza). */
  VENUE_MAP_URL:
    "https://www.google.com/maps/search/?api=1&query=9+Pyramids+Lounge+Giza",

  /* 3) Transport — confirm the wording, and optionally add a booking link.
        TRANSPORT_LINK_URL: leave "" for no button, or paste a URL + label. */
  TRANSPORT_TEXT: "You can use Uber, Careem, London Cab, or JTNY.",
  TRANSPORT_LINK_URL: "",
  TRANSPORT_LINK_LABEL: "Book a ride",
};

/* -------------------------------------------------------------------------- */

(function () {
  "use strict";

  function isUnset(url) {
    if (!url) return true;
    const v = String(url).trim();
    return v === "" || v === "#" || /[«»]/.test(v) || /GOOGLE_FORM_LINK/i.test(v);
  }

  function wireLink(el, url, pendingLabel) {
    if (!el) return;
    if (isUnset(url)) {
      el.classList.add("is-placeholder");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("role", "link");
      el.removeAttribute("href");
      if (pendingLabel) el.setAttribute("title", pendingLabel);
      el.addEventListener("click", function (e) { e.preventDefault(); });
    } else {
      el.setAttribute("href", url);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* Venue location */
    wireLink(document.querySelector('[data-map="venue"]'), CONFIG.VENUE_MAP_URL);

    /* Hotel special-rate links */
    wireLink(document.querySelector('[data-special-rate="marriott"]'),
             CONFIG.MARRIOTT_SPECIAL_RATE_URL, "Special rate link coming soon");
    wireLink(document.querySelector('[data-special-rate="hyatt"]'),
             CONFIG.HYATT_SPECIAL_RATE_URL, "Special rate link coming soon");

    /* RSVP */
    const rsvpBtn = document.querySelector("[data-rsvp]");
    const rsvpPending = document.getElementById("rsvpPending");
    wireLink(rsvpBtn, CONFIG.RSVP_FORM_URL, "RSVP link coming soon");
    if (rsvpBtn && rsvpBtn.classList.contains("is-placeholder") && rsvpPending) {
      rsvpPending.hidden = false;
    }

    /* Transport copy + optional booking button */
    const transportText = document.getElementById("transportText");
    if (transportText) transportText.textContent = CONFIG.TRANSPORT_TEXT;

    const transportAction = document.getElementById("transportAction");
    if (transportAction && !isUnset(CONFIG.TRANSPORT_LINK_URL)) {
      const a = document.createElement("a");
      a.className = "btn btn--primary";
      a.href = CONFIG.TRANSPORT_LINK_URL;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = CONFIG.TRANSPORT_LINK_LABEL || "Book a ride";
      transportAction.appendChild(a);
    }
  });
})();
