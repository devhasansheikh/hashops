"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Animated brand backdrop — a glowing planet-limb horizon arc with an
 * atmospheric halo and god-rays (inspired by the reference hero), rendered in
 * the Flame palette on obsidian. Raw WebGL2 fragment shader on a single
 * fullscreen triangle: no three.js, one draw call, very light.
 *
 * Fixed behind the hero; fades + pauses on scroll so lower sections sit on the
 * flat page bg. Honors prefers-reduced-motion (renders one static frame) and
 * falls back to a CSS glow if WebGL is unavailable.
 */

const VERT = `#version 300 es
in vec2 a;
out vec2 vUv;
void main(){ vUv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 frag;
uniform vec2 uRes;
uniform float uTime;
uniform float uTheme;   // 0 dark .. 1 light
uniform vec2 uMouse;    // -1..1

float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }

void main(){
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 q = uv - 0.5;
  q.x *= aspect;
  q -= uMouse * 0.016;
  float t = uTime;

  // Planet limb: a large circle whose top arc sits above the hero copy. Kept
  // mostly dark — a thin bright rim with a contained halo (not a wash).
  vec2 C = vec2(0.0, -0.97);
  float R = 1.34;
  float r = length(q - C);
  float edge = r - R;                 // >0 sky (above arc), <0 ground (below)

  float along = exp(-q.x*q.x*1.7);    // brightness peaks at centre-top

  float above = smoothstep(-0.015, 0.025, edge);                // 0 below arc, 1 above
  float rim   = exp(-abs(edge)*86.0) * mix(0.05, 1.0, along);   // thin bright limb
  float atmo  = exp(-max(edge,0.0)*6.4) * along * above;        // halo ABOVE the arc only
  float inner = exp(-max(-edge,0.0)*15.0) * along * 0.3 * (1.0 - above); // faint inner lip below

  // God-rays radiating from the apex.
  vec2 A = vec2(0.0, C.y + R);
  vec2 d = q - A;
  float ang = atan(d.x, max(d.y, 0.0001));
  float rayN = fbm(vec2(ang*5.0, length(d)*1.3 - t*0.09));
  float rays = smoothstep(0.52, 0.97, rayN) * atmo * 0.65;

  float breathe = 0.9 + 0.1*sin(t*0.35);
  float glow = (rim*0.95 + atmo*0.4 + inner*0.26 + rays*0.4) * breathe;

  vec3 ember = vec3(0.52,0.14,0.0);
  vec3 flame = vec3(1.0,0.47,0.11);
  vec3 sun   = vec3(1.0,0.72,0.33);
  vec3 hot   = vec3(1.0,0.93,0.80);
  vec3 col = mix(ember, flame, smoothstep(0.0,0.5,glow));
  col = mix(col, sun, smoothstep(0.5,1.0,glow));
  col = mix(col, hot, smoothstep(1.05,1.7,rim*1.25));

  // bases match the CSS --bg tokens so the canvas edge is seamless
  vec3 darkBase = vec3(0.039,0.039,0.043);
  vec3 darkOut = darkBase + col*glow;

  // Light theme: a soft warm dawn band over bone — airy, not glowy.
  vec3 lightBase = vec3(0.980,0.980,0.969);
  vec3 warm = vec3(1.0,0.80,0.58);
  float lg = clamp(glow*0.6, 0.0, 0.9);
  vec3 lightOut = mix(lightBase, warm, lg*0.75);
  lightOut = mix(lightOut, vec3(1.0,0.58,0.22), clamp(rim*0.42,0.0,0.5));

  vec3 outc = mix(darkOut, lightOut, uTheme);

  // film grain
  float g = (hash(uv*uRes + fract(t)) - 0.5) * mix(0.028, 0.012, uTheme);
  outc += g;

  frag = vec4(outc, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(0);
  themeRef.current = resolvedTheme === "light" ? 1 : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Site-level opt-in (data-reduce-motion="true" on <html>), NOT the OS
    // prefers-reduced-motion setting — so the animated backdrop keeps running
    // and follows theme toggles on every device by default.
    const reduce = document.documentElement.dataset.reduceMotion === "true";
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      // no WebGL2 — leave the CSS fallback visible
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "a");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (fallbackRef.current) fallbackRef.current.style.opacity = "1";
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uTheme = gl.getUniformLocation(prog, "uTheme");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const dprCap = window.innerWidth < 768 ? 1.25 : 1.5;
    let w = 0,
      h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      w = Math.floor(canvas.clientWidth * dpr);
      h = Math.floor(canvas.clientHeight * dpr);
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let themeMix = themeRef.current;
    let paused = false;
    let visible = true;
    const onVis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // fade + pause on scroll (arc only lives behind the hero)
    const onScroll = () => {
      const vh = window.innerHeight;
      const k = Math.max(0, 1 - window.scrollY / (vh * 0.85));
      if (fallbackRef.current) {
        /* fallback follows the same fade if shown */
      }
      canvas.style.opacity = String(k);
      paused = window.scrollY > vh * 1.15;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      const time = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      themeMix += (themeRef.current - themeMix) * 0.08;
      if (w !== Math.floor(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, dprCap)))
        resize();
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uTheme, themeMix);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduce) {
      render(start); // one static frame
    } else {
      const loop = (now: number) => {
        if (visible && !paused) render(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* CSS fallback (only shown if WebGL fails) */}
      <div
        ref={fallbackRef}
        className="backdrop-fallback absolute inset-0 opacity-0 transition-opacity duration-500"
      />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
