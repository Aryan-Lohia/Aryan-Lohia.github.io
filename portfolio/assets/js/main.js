(function () {
  var WA_NUMBER = "917864955155";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function waUrl(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  document.querySelectorAll("[data-wa]").forEach(function (link) {
    var message = link.getAttribute("data-wa");
    if (message) link.href = waUrl(message);
  });

  /* Loader: type the line, hold at least 1.2s, never past 4s. */
  var pre = document.getElementById("preloader");
  var sans = document.getElementById("pl-sans");
  var serif = document.getElementById("pl-serif");
  var status = document.getElementById("pl-status");
  var started = Date.now();
  var MIN = reduce ? 280 : 1200;
  var MAX = 4000;
  var gone = false;

  function typeLine(el, text, done) {
    if (reduce || !el) {
      if (el) el.textContent = text;
      if (done) done();
      return;
    }
    el.textContent = "";
    var i = 0;
    var timer = setInterval(function () {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
        if (done) done();
      }
    }, 55);
  }

  function hideLoader() {
    if (gone || !pre) {
      document.documentElement.classList.add("ready");
      startReveals();
      return;
    }
    gone = true;
    document.documentElement.classList.add("ready");
    pre.classList.add("done");
    pre.setAttribute("aria-busy", "false");
    if (status) status.textContent = "Aryan Lohia is ready";
    setTimeout(startReveals, reduce ? 0 : 200);
    setTimeout(function () { pre.remove(); }, reduce ? 220 : 700);
  }

  function armLoader() {
    var wait = Math.max(0, MIN - (Date.now() - started));
    setTimeout(hideLoader, wait);
  }

  if (pre) {
    pre.setAttribute("aria-busy", "true");
    if (reduce) {
      if (sans) sans.textContent = "AI made";
      if (serif) serif.textContent = "easy.";
      if (document.readyState === "complete") armLoader();
      else window.addEventListener("load", armLoader);
    } else {
      typeLine(sans, "AI made", function () {
        typeLine(serif, "easy.", function () {
          if (document.readyState === "complete") armLoader();
          else window.addEventListener("load", armLoader);
        });
      });
    }
    setTimeout(hideLoader, MAX);
  } else {
    document.documentElement.classList.add("ready");
    startReveals();
  }

  /* Menu */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("open", open);
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    if (header) header.classList.toggle("menu-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  function startReveals() {
    var nodes = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) { node.classList.add("in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  /* Header colour follows the band under it. */
  var bands = document.querySelectorAll("[data-band]");
  function paintHeader() {
    if (!header || header.classList.contains("menu-open")) return;
    var mark = varNav();
    var current = "charcoal";
    bands.forEach(function (band) {
      var rect = band.getBoundingClientRect();
      if (rect.top <= mark && rect.bottom > mark) current = band.getAttribute("data-band") || current;
    });
    header.setAttribute("data-band", current);
    header.classList.toggle("is-solid", window.scrollY > 24);
    header.classList.toggle("on-dark", current === "charcoal" || current === "forest");
  }
  function varNav() { return 36; }
  window.addEventListener("scroll", paintHeader, { passive: true });
  paintHeader();

  /* Mobile bar hides on the contact band. */
  var bar = document.querySelector(".mobile-bar");
  var contact = document.getElementById("contact");
  var narrow = window.matchMedia("(max-width: 959px)");
  function onBar() {
    if (!bar || !contact) return;
    if (!narrow.matches) {
      bar.classList.remove("is-hidden");
      return;
    }
    var rect = contact.getBoundingClientRect();
    bar.classList.toggle("is-hidden", rect.top < window.innerHeight * 0.72 && rect.bottom > 80);
  }
  window.addEventListener("scroll", onBar, { passive: true });
  window.addEventListener("resize", onBar);
  onBar();

  /* Enquiry form */
  var form = document.getElementById("enquiry");
  var nameInput = document.getElementById("name");
  var interestInput = document.getElementById("interest");
  var noteInput = document.getElementById("note");
  var nameError = document.getElementById("name-error");
  var interestError = document.getElementById("interest-error");
  var preview = document.getElementById("wa-preview");
  var send = document.getElementById("send-wa");
  var storeKey = "al-portfolio-enquiry";
  if (!form || !nameInput || !interestInput || !noteInput || !send || !preview) return;

  function clean(value, max) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  }
  function defaultMessage() {
    return send.getAttribute("data-wa") || "Hi Aryan, I found your portfolio and would like to get in touch.";
  }
  function composed() {
    var name = clean(nameInput.value, 80);
    var interest = interestInput.value;
    var note = clean(noteInput.value, 400);
    if (!name || !interest) return defaultMessage();
    var message = "Hi Aryan, I'm " + name + ". I'd like to talk about " + interest + ".";
    if (note) message += " " + note;
    return message;
  }
  function paint() {
    var message = composed();
    preview.textContent = message;
    send.href = waUrl(message);
  }
  function save() {
    try {
      localStorage.setItem(storeKey, JSON.stringify({
        name: nameInput.value,
        interest: interestInput.value,
        note: noteInput.value
      }));
    } catch (error) { /* storage can be blocked */ }
  }
  function restore() {
    try {
      var raw = localStorage.getItem(storeKey);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return;
      if (typeof data.name === "string") nameInput.value = data.name.slice(0, 80);
      if (typeof data.interest === "string") {
        var match = Array.prototype.some.call(interestInput.options, function (option) {
          return option.value === data.interest;
        });
        if (match) interestInput.value = data.interest;
      }
      if (typeof data.note === "string") noteInput.value = data.note.slice(0, 400);
    } catch (error) { /* ignore a bad draft */ }
  }
  function setError(el, field, message) {
    el.textContent = message;
    field.classList.toggle("is-invalid", Boolean(message));
    var control = field.querySelector("input, select, textarea");
    if (!control) return;
    if (message) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", el.id);
    } else {
      control.removeAttribute("aria-invalid");
    }
  }
  function validate() {
    var nameOk = clean(nameInput.value, 80).length >= 2;
    var interestOk = interestInput.value !== "";
    setError(nameError, document.getElementById("field-name"), nameOk ? "" : "Add your name so I know who is writing.");
    setError(interestError, document.getElementById("field-interest"), interestOk ? "" : "Choose what you want to talk about.");
    if (!nameOk) { nameInput.focus(); return false; }
    if (!interestOk) { interestInput.focus(); return false; }
    return true;
  }
  restore();
  paint();
  [nameInput, interestInput, noteInput].forEach(function (field) {
    field.addEventListener("input", function () {
      save();
      paint();
      if (field === nameInput && clean(nameInput.value, 80).length >= 2) setError(nameError, document.getElementById("field-name"), "");
      if (field === interestInput && interestInput.value) setError(interestError, document.getElementById("field-interest"), "");
    });
  });
  send.addEventListener("click", function (event) {
    paint();
    if (!validate()) event.preventDefault();
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    paint();
    if (validate()) send.click();
  });
})();
