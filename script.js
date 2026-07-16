(() => {
  const body = document.body;

  /* ---------- Logo: English / Farsi word swap ---------- */
  const LEAVE_BUFFER = 140;
  document.querySelectorAll(".logo__word").forEach((word) => {
    const live = word.querySelector(".logo__live");
    let leaveTimer;

    const toFa = () => {
      clearTimeout(leaveTimer);
      word.classList.add("is-fa");
      live.textContent = word.dataset.fa;
      live.setAttribute("dir", "rtl");
    };
    const toEn = () => {
      word.classList.remove("is-fa");
      live.textContent = word.dataset.en;
      live.removeAttribute("dir");
    };
    // Small grace period so a brief cursor slip doesn't flicker the word back.
    const toEnBuffered = () => {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(toEn, LEAVE_BUFFER);
    };

    word.addEventListener("mouseenter", toFa);
    word.addEventListener("mouseleave", toEnBuffered);
    word.addEventListener("focus", toFa);
    word.addEventListener("blur", toEn);
    word.addEventListener("click", () => {
      word.classList.contains("is-fa") ? toEn() : toFa();
    });
  });

  /* ---------- Thumbnail strip + lightbox scrub ---------- */
  const IMAGES = [
    { src: "assets/images/1.jpg", caption: "Class photo\nSpring session" },
    { src: "assets/images/2.jpg", caption: "Nowruz celebration" },
    { src: "assets/images/3.jpg", caption: "Persian alphabet workshop" },
    { src: "assets/images/4.jpg", caption: "Music class\nSaturday program" },
    { src: "assets/images/5.jpg", caption: "Art workshop" },
    { src: "assets/images/6.jpg", caption: "Storytime" },
    { src: "assets/images/7.jpg", caption: "Haft-sin table\nNowruz" },
    { src: "assets/images/8.jpg", caption: "Calligraphy practice" },
    { src: "assets/images/9.jpg", caption: "End-of-year recital" },
    { src: "assets/images/10.jpg", caption: "Drawing\nZara, 8 years old" },
  ];
  const LOOPS = 4;

  const strip = document.getElementById("strip");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  for (let i = 0; i < LOOPS; i++) {
    IMAGES.forEach((image, index) => {
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.dataset.index = index;
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
      strip.appendChild(thumb);
    });
  }

  let shownIndex = -1;

  const show = (index) => {
    if (index === shownIndex) return;
    shownIndex = index;
    const image = IMAGES[index];
    lightboxImg.src = image.src;
    lightboxCaption.textContent = image.caption;
    body.classList.add("is-scrubbing");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const hide = () => {
    shownIndex = -1;
    body.classList.remove("is-scrubbing");
    lightbox.setAttribute("aria-hidden", "true");
  };

  const scrubTo = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const thumb = el && el.closest(".thumb");
    if (thumb) show(Number(thumb.dataset.index));
  };

  strip.addEventListener("pointerenter", (e) => {
    if (body.dataset.view === "info") return;
    scrubTo(e.clientX, e.clientY);
  });
  strip.addEventListener("pointermove", (e) => {
    if (body.dataset.view === "info") return;
    scrubTo(e.clientX, e.clientY);
  });
  strip.addEventListener("pointerleave", hide);
  strip.addEventListener("pointercancel", hide);
  strip.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse") hide();
  });

  /* ---------- Home / Info views (with browser history) ---------- */
  const info = document.getElementById("info");

  const applyView = (view) => {
    body.dataset.view = view;
    info.setAttribute("aria-hidden", view === "info" ? "false" : "true");
    if (view === "info") hide();
  };

  const goInfo = () => {
    if (location.hash !== "#info") {
      history.pushState({ view: "info" }, "", "#info");
    }
    applyView("info");
  };

  const goHome = () => {
    // Prefer stepping back so the history entry is consumed and Forward works.
    if (location.hash === "#info") {
      history.back();
    } else {
      applyView("home");
    }
  };

  document.querySelectorAll('a[href="#info"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      goInfo();
    });
  });

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      goHome();
    });
  });

  window.addEventListener("popstate", () => {
    applyView(location.hash === "#info" ? "info" : "home");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") goHome();
  });

  applyView(location.hash === "#info" ? "info" : "home");
})();
