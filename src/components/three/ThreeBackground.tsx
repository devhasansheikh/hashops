"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useTheme } from "next-themes";
import { HashField } from "./HashField";

/** Clean static backdrop used for reduced-motion + any WebGL failure. */
function StaticBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 18%, var(--flame-glow), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border-strong) 1px, transparent 0)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(80% 60% at 50% 10%, #000, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(80% 60% at 50% 10%, #000, transparent 75%)",
        }}
      />
    </div>
  );
}

class GLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function useDeviceProfile() {
  const [profile, setProfile] = useState<{ count: number; dprMax: number; mobile: boolean }>(
    { count: 44, dprMax: 1.8, mobile: false },
  );
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const cores = navigator.hardwareConcurrency || 8;
      const lowPower = cores <= 4;
      let count = 44;
      let dprMax = 1.8;
      let mobile = false;
      if (w < 640) {
        count = lowPower ? 12 : 16;
        dprMax = 1.4;
        mobile = true;
      } else if (w < 1024) {
        count = 28;
        dprMax = 1.6;
        mobile = true;
      } else if (lowPower) {
        count = 30;
      }
      setProfile({ count, dprMax, mobile });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return profile;
}

export default function ThreeBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const profile = useDeviceProfile();

  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const canvasWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pointer parallax (global, since the canvas itself is non-interactive)
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  // Scroll → camera dolly, canvas fade, and offscreen pause
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const s = window.scrollY / vh;
      scroll.current = s;
      if (canvasWrap.current) {
        canvasWrap.current.style.opacity = String(
          Math.max(0.26, Math.min(1, 1 - s * 0.55)),
        );
      }
      setActive((prev) => {
        const next = !document.hidden && s < 1.9;
        return prev === next ? prev : next;
      });
    };
    const onVis = () => onScroll();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  const isDark = resolvedTheme !== "light";
  const fogColor = isDark ? "#0a0a0b" : "#fafaf7";

  const dpr = useMemo<[number, number]>(() => [1, profile.dprMax], [profile.dprMax]);

  if (!mounted || reduced) return <StaticBackdrop />;

  return (
    <GLBoundary fallback={<StaticBackdrop />}>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div
          ref={canvasWrap}
          className="absolute inset-0 will-change-[opacity]"
          style={{ transition: "opacity 0.3s linear" }}
        >
          <Canvas
            frameloop={active ? "always" : "never"}
            dpr={dpr}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 90 }}
            style={{ pointerEvents: "none" }}
          >
            <fog attach="fog" args={[fogColor, 9, 34]} />
            <HashField
              count={profile.count}
              isDark={isDark}
              pointer={pointer}
              scroll={scroll}
            />
            <EffectComposer enableNormalPass={false} multisampling={profile.mobile ? 0 : 4}>
              <Bloom
                intensity={isDark ? 0.9 : 0.42}
                luminanceThreshold={0.18}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.7}
              />
              <Vignette eskil={false} offset={0.28} darkness={isDark ? 0.72 : 0.32} />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Subtle scrim so foreground copy always stays legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 42%, var(--bg) 100%)",
            opacity: 0.55,
          }}
        />
      </div>
    </GLBoundary>
  );
}
