/* Interaction layer: custom cursor, magnetic buttons, 3D tilt,
   scroll reveals, terminal typing. All disabled under reduced motion. */

export function initCursor() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.body.classList.add("has-cursor");

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let x = -100, y = -100, rx = -100, ry = -100;

  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  });

  const loop = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  for (const el of document.querySelectorAll("a, button, .feat-row")) {
    el.addEventListener("pointerenter", () => document.body.classList.add("cursor-hot"));
    el.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hot"));
  }
}

export function initMagnetic() {
  for (const btn of document.querySelectorAll(".btn")) {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  }
}

export function initTilt() {
  const el = document.querySelector(".workspace");
  const zone = document.querySelector(".workspace-section");
  if (!el || !zone) return;

  zone.addEventListener("pointermove", (e) => {
    const r = zone.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 5}deg)`;
  });
  zone.addEventListener("pointerleave", () => { el.style.transform = ""; });
}

export function initReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 }
  );
  for (const el of document.querySelectorAll(".reveal")) io.observe(el);
}

export function initNavScroll() {
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

const TERM_SCRIPT = [
  { text: "$ npm run dev", cls: "prompt-line", delay: 500 },
  { text: "forge  dev server warming…", cls: "dim", delay: 700 },
  { text: "VITE v5.2.0  ready in 302 ms", cls: "ok", delay: 350 },
  { text: "➜  Local: http://localhost:5173/", cls: "", delay: 250 },
];

export function initTerminal(reducedMotion) {
  const term = document.querySelector("#term-lines");
  if (!term) return;

  const render = (line) => {
    const p = document.createElement("p");
    if (line.cls === "prompt-line") {
      p.innerHTML = `<span class="prompt">$</span> ${line.text.slice(2)}`;
    } else {
      p.textContent = line.text;
      if (line.cls) p.className = line.cls;
    }
    term.appendChild(p);
  };

  if (reducedMotion) {
    TERM_SCRIPT.forEach(render);
    return;
  }

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    let acc = 0;
    for (const line of TERM_SCRIPT) {
      acc += line.delay;
      setTimeout(() => render(line), acc);
    }
  }, { threshold: 0.4 });
  io.observe(term);
}

export function splitHeadline() {
  const h1 = document.querySelector(".hero h1");
  if (!h1) return;
  let i = 0;
  for (const node of h1.querySelectorAll("[data-split]")) {
    const chars = [...node.textContent];
    node.textContent = "";
    for (const ch of chars) {
      if (ch === " ") {
        node.appendChild(document.createTextNode(" "));
        continue;
      }
      const span = document.createElement("span");
      span.className = "ch";
      span.style.setProperty("--d", `${i * 28}ms`);
      span.textContent = ch;
      node.appendChild(span);
      i += 1;
    }
  }
}
