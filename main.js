(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".timeline__item").forEach(function (el) {
    if (prefersReduced) {
      el.classList.add("is-visible");
      return;
    }
    const obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    obs.observe(el);
  });

  function animateCount(el, target, duration) {
    const start = performance.now();
    const isInfinity = target === Infinity || el.textContent.trim() === "∞";
    if (isInfinity) return;

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(eased * target);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!prefersReduced) {
    const statValues = document.querySelectorAll(".stat-card__value[data-count]");
    const statsObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          if (!Number.isNaN(target)) {
            animateCount(el, target, 1400);
          }
          statsObs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    statValues.forEach(function (v) {
      statsObs.observe(v);
    });
  } else {
    document.querySelectorAll(".stat-card__value[data-count]").forEach(function (el) {
      const n = el.getAttribute("data-count");
      if (n) el.textContent = n;
    });
  }
})();
