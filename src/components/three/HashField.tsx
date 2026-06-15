"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createHashGeometry } from "./hashGeometry";

interface HashFieldProps {
  count: number;
  isDark: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
  scroll: MutableRefObject<number>;
}

interface Inst {
  pos: THREE.Vector3;
  rot: THREE.Euler;
  axis: THREE.Vector3;
  scale: number;
  speed: number;
  floatPhase: number;
  floatAmp: number;
}

// Tiny deterministic PRNG so the layout is stable between renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dummy = new THREE.Object3D();
const tmpQuat = new THREE.Quaternion();

export function HashField({ count, isDark, pointer, scroll }: HashFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const geometry = useMemo(() => createHashGeometry(), []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isDark ? new THREE.Color("#17171c") : new THREE.Color("#e7e3d8"),
      metalness: isDark ? 0.82 : 0.5,
      roughness: isDark ? 0.34 : 0.46,
      emissive: new THREE.Color("#ff6a12"),
      emissiveIntensity: isDark ? 0.16 : 0.08,
      envMapIntensity: 0.8,
    });
  }, [isDark]);

  const instances = useMemo<Inst[]>(() => {
    const rand = mulberry32(20260613);
    const out: Inst[] = [];
    for (let i = 0; i < count; i++) {
      const depth = -26 + rand() * 30; // z from -26 (far) to ~4 (near)
      const spread = 13 + (-depth) * 0.55; // wider spread further back
      out.push({
        pos: new THREE.Vector3(
          (rand() - 0.5) * spread * 2.1,
          (rand() - 0.5) * spread * 1.4,
          depth,
        ),
        rot: new THREE.Euler(
          rand() * Math.PI,
          rand() * Math.PI,
          (rand() - 0.5) * 0.6 - 0.28, // bias toward the brand ~16° tilt
        ),
        axis: new THREE.Vector3(
          rand() - 0.5,
          rand() - 0.5,
          rand() - 0.5,
        ).normalize(),
        scale: 0.32 + rand() * 0.95,
        speed: (rand() - 0.5) * 0.18,
        floatPhase: rand() * Math.PI * 2,
        floatAmp: 0.15 + rand() * 0.5,
      });
    }
    return out;
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < instances.length; i++) {
      const inst = instances[i];
      // base orientation + slow spin around a per-instance axis
      dummy.position.set(
        inst.pos.x,
        inst.pos.y + Math.sin(t * 0.4 + inst.floatPhase) * inst.floatAmp,
        inst.pos.z,
      );
      dummy.quaternion.setFromEuler(inst.rot);
      tmpQuat.setFromAxisAngle(inst.axis, t * inst.speed);
      dummy.quaternion.multiply(tmpQuat);
      dummy.scale.setScalar(inst.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Cursor parallax on the whole group (eased)
    const g = groupRef.current;
    if (g) {
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.18, 0.045);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.12, 0.045);
      g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.current.x * 0.8, 0.04);
    }

    // Scroll dolly — camera drifts back and down as you scroll the hero away
    const s = scroll.current;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9 + s * 5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, s * -1.6, 0.05);
    camera.lookAt(0, 0, -6);
  });

  return (
    <group ref={groupRef}>
      {/* Lighting — soft volumetric Flame on obsidian */}
      <ambientLight intensity={isDark ? 0.1 : 0.45} />
      <directionalLight
        position={[-6, 7, 6]}
        intensity={isDark ? 3.4 : 2.2}
        color="#ff7a1a"
      />
      <pointLight position={[8, -3, 2]} intensity={isDark ? 28 : 12} color="#ffa033" distance={40} decay={1.5} />
      <pointLight position={[-9, -6, -4]} intensity={isDark ? 14 : 6} color="#3a2a6a" distance={50} decay={1.6} />
      <directionalLight position={[2, 4, -8]} intensity={isDark ? 0.5 : 0.8} color="#cfd0ff" />

      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
}
