(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var shell = document.querySelector(".shell-header");
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav && menu) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  if (shell) {
    function onScroll() {
      shell.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function observeReveal(selector, options) {
    var nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;
    if (prefersReduced) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      options || { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    nodes.forEach(function (el) {
      obs.observe(el);
    });
  }

  observeReveal(".reveal");
  observeReveal(".timeline__item", { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  if (prefersReduced) {
    document.querySelectorAll(".timeline__item").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function animateCount(el, target, duration) {
    var start = performance.now();
    if (el.textContent.trim() === "∞") return;

    function frame(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var value = Math.round(eased * target);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!prefersReduced) {
    var statValues = document.querySelectorAll(".stat-card__value[data-count]");
    var statsObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          if (!Number.isNaN(target)) {
            animateCount(el, target, 1500);
          }
          statsObs.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );
    statValues.forEach(function (v) {
      statsObs.observe(v);
    });
  } else {
    document.querySelectorAll(".stat-card__value[data-count]").forEach(function (el) {
      var n = el.getAttribute("data-count");
      if (n) el.textContent = n;
    });
  }
})();
