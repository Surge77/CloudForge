"use client";

import { useEffect, useRef } from "react";

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHeat;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = rot * p * 2.05; a *= 0.5; }
  return v;
}

vec3 heatRamp(float t){
  vec3 black = vec3(0.043, 0.031, 0.024);
  vec3 coal  = vec3(0.13, 0.07, 0.04);
  vec3 deep  = vec3(0.42, 0.13, 0.05);
  vec3 ember = vec3(0.91, 0.39, 0.17);
  vec3 gold  = vec3(0.99, 0.72, 0.38);
  vec3 c = mix(black, coal, smoothstep(0.0, 0.35, t));
  c = mix(c, deep, smoothstep(0.3, 0.62, t));
  c = mix(c, ember, smoothstep(0.55, 0.85, t));
  c = mix(c, gold, smoothstep(0.82, 1.0, t));
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.055;
  vec2 q = vec2(fbm(p * 2.1 + vec2(0.0, -t * 1.6)), fbm(p * 2.1 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 2.1 + 3.4 * q + vec2(1.7, 9.2)), fbm(p * 2.1 + 3.4 * q + vec2(8.3, 2.8) + t * 0.4));
  float f = fbm(p * 2.1 + 3.2 * r);
  float seam = smoothstep(0.42, 0.52, f) * smoothstep(0.68, 0.55, f);
  float glow = pow(f, 2.3) + seam * 0.85;
  vec2 m = uMouse;
  float d = distance(p, m);
  glow += uHeat * exp(-d * d * 9.0) * 0.5;
  glow *= mix(0.35, 1.15, pow(1.0 - uv.y, 1.4));
  vec3 col = heatRamp(clamp(glow, 0.0, 1.0));
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.02;
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= mix(0.75, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export function ForgeShader({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uHeat = gl.getUniformLocation(prog, "uHeat");

    const density = Math.min(window.devicePixelRatio, 2) * 0.6;
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * density);
      canvas.height = Math.floor(canvas.clientHeight * density);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0.5, my = 0.35, heat = 0, target = 0;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = 1 - (e.clientY - rect.top) / rect.height;
      target = 1;
    };
    const onLeave = () => { target = 0; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    let raf = 0;
    const start = performance.now();
    const frame = () => {
      if (visible) {
        heat += (target - heat) * 0.04;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (performance.now() - start) / 1000);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uHeat, heat);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
