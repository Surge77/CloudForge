import { initForgeShader } from "./shader.js";
import {
  initCursor,
  initMagnetic,
  initTilt,
  initReveals,
  initNavScroll,
  initTerminal,
  splitHeadline,
} from "./fx.js";

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

splitHeadline();
initForgeShader(document.getElementById("forge-canvas"), reducedMotion);
initReveals();
initNavScroll();
initTerminal(reducedMotion);

if (!reducedMotion) {
  initCursor();
  initMagnetic();
  initTilt();
}

// ignite the headline once fonts are ready so chars don't reflow mid-animation
document.fonts.ready.then(() => {
  requestAnimationFrame(() => document.querySelector(".hero").classList.add("lit"));
});
