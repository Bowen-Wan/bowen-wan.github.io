"use strict";

document.getElementById("year").textContent = new Date().getFullYear();

const cursorGlow = document.getElementById("cursorGlow");
let mouse = { x: 0, y: 0 };
let glowPos = { x: 0, y: 0 };
let glowRAF;

function animateGlow() {
  const speed = 0.1;
  glowPos.x += (mouse.x - glowPos.x) * speed;
  glowPos.y += (mouse.y - glowPos.y) * speed;
  cursorGlow.style.left = glowPos.x + "px";
  cursorGlow.style.top  = glowPos.y + "px";
  glowRAF = requestAnimationFrame(animateGlow);
}

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (!cursorGlow.classList.contains("visible")) {
    cursorGlow.classList.add("visible");
    glowPos = { x: e.clientX, y: e.clientY };
    animateGlow();
  }
});

document.addEventListener("mouseleave", () => {
  cursorGlow.classList.remove("visible");
  cancelAnimationFrame(glowRAF);
});

const glowColors = {
  "#contact-information": { r: 43,  g: 108, b: 176 },
  "#objective":           { r: 88,  g: 101, b: 242 },
  "#education":           { r: 183, g: 121, b: 31  },
  "#experience":          { r: 43,  g: 108, b: 176 },
  "#skills":              { r: 39,  g: 103, b: 73  },
};


document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  });
});

const html        = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");

const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark" : "light";
applyTheme(localStorage.getItem("theme") || systemPref);

themeToggle.addEventListener("click", () => {
  const next = html.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

function applyTheme(theme) {
  html.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
}

const progressBar = document.getElementById("scrollProgress");
const siteHeader  = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
  siteHeader.classList.toggle("scrolled", scrolled > 20);
}, { passive: true });

const cards = document.querySelectorAll(".card");

const entranceObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entranceObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.07 }
);

cards.forEach((card, i) => {
  card.style.transitionDelay = i * 0.07 + "s";
  entranceObserver.observe(card);
});

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);

sections.forEach((s) => navObserver.observe(s));


document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const header = document.getElementById("siteHeader");
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  });
});

document.querySelectorAll(".collapsible-body").forEach((body) => {
  body.style.maxHeight = body.scrollHeight + 100 + "px";
});

document.querySelectorAll(".section-toggle").forEach((toggle) => {
  const bodyId = toggle.getAttribute("aria-controls");
  const body   = document.getElementById(bodyId);
  if (!body) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      body.style.maxHeight = body.scrollHeight + "px";
      requestAnimationFrame(() => {
        body.style.maxHeight = "0px";
        body.classList.add("closed");
      });
      toggle.setAttribute("aria-expanded", "false");
    } else {
      body.style.maxHeight = body.scrollHeight + 100 + "px";
      body.classList.remove("closed");
      toggle.setAttribute("aria-expanded", "true");
    }
  });

  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.click();
    }
  });
});

const toast     = document.getElementById("copyToast");
let   toastTimer;

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.copy;
    const msg  = btn.dataset.toast || "Copied!";
    navigator.clipboard.writeText(text)
      .then(() => showToast(msg))
      .catch(() => showToast("Copy not supported"));
  });
});

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

const skillTags = document.querySelectorAll(".skill-tag");

const colorMap = {
  blue:   "#2b6cb0",
  green:  "#276749",
  gold:   "#b7791f",
  red:    "#c53030",
  purple: "#553c9a",
  teal:   "#0d9488",
  orange: "#c05621",
  yellow: "#975a16",
};

skillTags.forEach((tag) => {
  tag.addEventListener("mousedown", (e) => spawnParticles(e, tag));
});

function spawnParticles(e, tag) {
  const color  = colorMap[tag.dataset.color] || "#2b6cb0";
  const rect   = tag.getBoundingClientRect();
  const count  = 8;
  const cx     = rect.left + rect.width  / 2 + window.scrollX;
  const cy     = rect.top  + rect.height / 2 + window.scrollY;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.className = "particle";

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const dist  = 28 + Math.random() * 22;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const size  = 4 + Math.random() * 4;

    Object.assign(dot.style, {
      position:        "absolute",
      left:            cx + "px",
      top:             cy + "px",
      width:           size + "px",
      height:          size + "px",
      borderRadius:    "50%",
      background:      color,
      pointerEvents:   "none",
      zIndex:          "999",
      opacity:         "1",
      transform:       "translate(-50%, -50%)",
      transition:      "transform 0.55s cubic-bezier(0.2,0,0.8,1), opacity 0.55s ease",
      willChange:      "transform, opacity",
    });

    document.body.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
      dot.style.opacity   = "0";
    });

    setTimeout(() => dot.remove(), 600);
  }
}
