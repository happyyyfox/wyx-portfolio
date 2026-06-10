const body = document.body;
const languageButtons = document.querySelectorAll("[data-set-lang]");
const sideNav = document.querySelector(".side-nav");
const navLinks = [...document.querySelectorAll(".side-nav a")];

const languageMeta = {
  zh: {
    htmlLang: "zh-CN",
    title: "万羽旋 | AI 产品经理候选人",
    copy: "复制",
    copied: "已复制",
  },
  en: {
    htmlLang: "en",
    title: "Yuxuan Wan | AI Product Manager Candidate",
    copy: "Copy",
    copied: "Copied",
  },
};

function setLanguage(language) {
  const nextLanguage = languageMeta[language] ? language : "zh";
  body.classList.toggle("lang-zh", nextLanguage === "zh");
  body.classList.toggle("lang-en", nextLanguage === "en");
  document.documentElement.lang = languageMeta[nextLanguage].htmlLang;
  document.title = languageMeta[nextLanguage].title;
  localStorage.setItem("portfolio-language", nextLanguage);

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.setLang === nextLanguage);
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.dataset.feedback = languageMeta[nextLanguage].copy;
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.setLang));
});

setLanguage(localStorage.getItem("portfolio-language") || "zh");

const copyButtons = document.querySelectorAll("[data-copy]");

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

copyButtons.forEach((button) => {
  const currentLanguage = body.classList.contains("lang-en") ? "en" : "zh";
  button.dataset.feedback = languageMeta[currentLanguage].copy;

  button.addEventListener("click", async () => {
    await copyText(button.dataset.copy);
    const activeLanguage = body.classList.contains("lang-en") ? "en" : "zh";
    button.dataset.feedback = languageMeta[activeLanguage].copied;
    button.classList.add("is-copied");
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.dataset.feedback = languageMeta[activeLanguage].copy;
    }, 1200);
  });
});

const revealTargets = document.querySelectorAll(
  ".section, .timeline-item, .experience-item, .project-card, .panel",
);

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-36% 0px -48% 0px",
    threshold: [0.08, 0.18, 0.32],
  },
);

sections.forEach((section) => navObserver.observe(section));

function updateChrome() {
  const pastHero = window.scrollY > window.innerHeight * 0.7;
  sideNav.classList.toggle("is-dark", pastHero);
}

updateChrome();
window.addEventListener("scroll", updateChrome, { passive: true });
