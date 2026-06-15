import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** A long, thin, rounded rectangle as a THREE.Shape. */
function roundedBar(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return s;
}

/**
 * Build one extruded "#" glyph from four rounded bars merged into a single
 * BufferGeometry (so it can be instanced). Centered at the origin.
 */
export function createHashGeometry(): THREE.BufferGeometry {
  const long = 3.5;
  const thin = 0.52;
  const radius = 0.26;
  const gap = 0.96; // bar offset from centre

  const extrude: THREE.ExtrudeGeometryOptions = {
    depth: 0.46,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 2,
    steps: 1,
  };

  const geoms: THREE.BufferGeometry[] = [];

  // Two vertical bars
  for (const dx of [-gap, gap]) {
    const g = new THREE.ExtrudeGeometry(roundedBar(thin, long, radius), extrude);
    g.translate(dx, 0, 0);
    geoms.push(g);
  }
  // Two horizontal bars
  for (const dy of [gap, -gap]) {
    const g = new THREE.ExtrudeGeometry(roundedBar(long, thin, radius), extrude);
    g.translate(0, dy, 0);
    geoms.push(g);
  }

  const merged = mergeGeometries(geoms, false);
  geoms.forEach((g) => g.dispose());
  merged.center();
  merged.computeVertexNormals();
  return merged;
}
