"use client";

import dynamic from "next/dynamic";

// The 3D background is client-only: dynamically imported with SSR disabled so
// Three.js never runs on the server, and code-split out of the initial bundle.
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

export function BackgroundMount() {
  return <ThreeBackground />;
}
