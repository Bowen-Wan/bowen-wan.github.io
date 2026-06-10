
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
  tag.addEventListener("mousedown", (e) => spawnParticles(e, e.currentTarget));
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
      position:      "absolute",
      left:          cx + "px",
      top:           cy + "px",
      width:         size + "px",
      height:        size + "px",
      borderRadius:  "50%",
      background:    color,
      pointerEvents: "none",
      zIndex:        "999",
      opacity:       "1",
      transform:     "translate(-50%, -50%)",
      transition:    "transform 0.55s cubic-bezier(0.2,0,0.8,1), opacity 0.55s ease",
      willChange:    "transform, opacity",
    });

    document.body.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
      dot.style.opacity   = "0";
    });

    setTimeout(() => dot.remove(), 600);
  }
}
