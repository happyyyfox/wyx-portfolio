document.documentElement.classList.add("js");

const body = document.body;
const siteHeader = document.querySelector(".site-header");
const languageButtons = [...document.querySelectorAll("[data-set-lang]")];
const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
const backgroundVideo = document.querySelector("#background-video");
const videoToggle = document.querySelector("[data-video-toggle]");
const videoToggleLabel = videoToggle?.querySelector(".video-toggle-label");

const languageMeta = {
  zh: {
    htmlLang: "zh-CN",
    title: "welcome!",
    videoPause: "暂停动态",
    videoPlay: "播放动态",
    videoPauseAria: "暂停动态背景",
    videoPlayAria: "播放动态背景",
  },
  en: {
    htmlLang: "en",
    title: "welcome!",
    videoPause: "Pause motion",
    videoPlay: "Play motion",
    videoPauseAria: "Pause animated background",
    videoPlayAria: "Play animated background",
  },
};

let currentLanguage = "zh";

function getSavedLanguage() {
  try {
    return localStorage.getItem("portfolio-language");
  } catch {
    return null;
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem("portfolio-language", language);
  } catch {
    // The language switch still works when storage is unavailable.
  }
}

function updateVideoControl() {
  if (!backgroundVideo || !videoToggle || !videoToggleLabel) return;

  const isPaused = backgroundVideo.paused;
  const labels = languageMeta[currentLanguage];

  videoToggle.dataset.state = isPaused ? "paused" : "playing";
  videoToggleLabel.textContent = isPaused ? labels.videoPlay : labels.videoPause;
  videoToggle.setAttribute("aria-label", isPaused ? labels.videoPlayAria : labels.videoPauseAria);
  videoToggle.setAttribute("aria-pressed", String(isPaused));
}

function setLanguage(language) {
  const nextLanguage = languageMeta[language] ? language : "zh";
  currentLanguage = nextLanguage;

  body.classList.toggle("lang-zh", nextLanguage === "zh");
  body.classList.toggle("lang-en", nextLanguage === "en");
  document.documentElement.lang = languageMeta[nextLanguage].htmlLang;
  document.title = languageMeta[nextLanguage].title;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.setLang === nextLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  saveLanguage(nextLanguage);
  updateVideoControl();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.setLang));
});

setLanguage(getSavedLanguage() || "zh");

if (backgroundVideo && videoToggle) {
  const markVideoReady = () => body.classList.add("video-ready");

  if (backgroundVideo.readyState >= 2) markVideoReady();

  backgroundVideo.addEventListener("loadeddata", markVideoReady, { once: true });
  backgroundVideo.addEventListener("play", updateVideoControl);
  backgroundVideo.addEventListener("pause", updateVideoControl);

  videoToggle.addEventListener("click", async () => {
    if (backgroundVideo.paused) {
      try {
        await backgroundVideo.play();
      } catch {
        updateVideoControl();
      }
    } else {
      backgroundVideo.pause();
    }
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) backgroundVideo.pause();

  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) backgroundVideo.pause();
  });

  updateVideoControl();
}

const revealTargets = [...document.querySelectorAll(".reveal")];

document.querySelectorAll(".experience-list, .project-grid, .capability-grid, .research-list, .award-grid").forEach((group) => {
  [...group.children].forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const sectionMap = new Map();
navigationLinks.forEach((link) => {
  const sectionId = link.getAttribute("href");
  if (!sectionMap.has(sectionId)) {
    const section = document.querySelector(sectionId);
    if (section) sectionMap.set(sectionId, section);
  }
});

function activateSection(sectionId) {
  navigationLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === sectionId);
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) activateSection(`#${visibleEntry.target.id}`);
    },
    {
      rootMargin: "-28% 0px -56% 0px",
      threshold: [0.02, 0.12, 0.28],
    },
  );

  sectionMap.forEach((section) => sectionObserver.observe(section));
}

function updateHeader() {
  siteHeader?.classList.remove("is-scrolled");
}

updateHeader();

const shoreStage = document.querySelector(".shore-stage");

function updateNavigationTone() {
  if (!shoreStage) return;

  const stageTop = shoreStage.getBoundingClientRect().top;
  body.classList.toggle("nav-on-light", stageTop < window.innerHeight * 0.52);
}

updateNavigationTone();
window.addEventListener("scroll", updateNavigationTone, { passive: true });
window.addEventListener("resize", updateNavigationTone);

const currentYear = document.querySelector("[data-current-year]");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
