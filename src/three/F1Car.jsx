import { Component, Suspense, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import F1CarProcedural from "./F1CarProcedural";
import { carConfig } from "../lib/data";

/**
 * Static, auto-fitting F1 car model for the interactive hero.
 *
 * - Auto-fits the GLB to `carConfig.targetSize` (bbox-measured, scale-uniform),
 *   centres it on X/Z and sits it on the floor (Y=0).
 * - No scroll choreography: the car sits at the origin and the user orbits it
 *   via <OrbitControls> in HeroCar.jsx.
 * - Falls back to procedural primitives if /models/f1-car/scene.gltf is missing.
 */
export default function CarModel(props) {
  return (
    <ErrorBoundary fallback={<F1CarProcedural />}>
      <Suspense fallback={<F1CarProcedural />}>
        <CarGLB {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/* ---------------- GLB loader + auto-fit ---------------- */

function CarGLB(props) {
  const { scene } = useGLTF(carConfig.modelPath);
  const clone = useMemo(() => scene.clone(true), [scene]);

  // Auto-fit + material tune (runs once when model loads).
  useEffect(() => {
    clone.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.frustumCulled = false;

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m) return;
        if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
          const hex = m.color?.getHexString?.() ?? "";
          const looksLight =
            hex &&
            (hex[0] === "c" ||
              hex[0] === "d" ||
              hex[0] === "e" ||
              hex[0] === "f" ||
              hex[0] >= "8");
          if (looksLight) {
            m.metalness = Math.max(m.metalness ?? 0, 0.85);
            m.roughness = Math.min(m.roughness ?? 1, 0.22);
          } else {
            m.metalness = Math.max(m.metalness ?? 0, 0.35);
            m.roughness = Math.min(m.roughness ?? 1, 0.45);
          }
          m.envMapIntensity = 1.6;
          m.needsUpdate = true;
        }
      });
    });

    // Bbox-fit: center on X/Z, sit on Y=0, scale longest dim to targetSize.
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const longest = Math.max(size.x, size.y, size.z) || 1;
    const autoScale = (carConfig.targetSize ?? 4) / longest;

    clone.scale.setScalar(autoScale);
    clone.position.x = -center.x * autoScale;
    clone.position.z = -center.z * autoScale;
    clone.position.y = -box.min.y * autoScale;
  }, [clone]);

  return (
    <group {...props}>
      <primitive object={clone} />
    </group>
  );
}

try {
  useGLTF.preload(carConfig.modelPath);
} catch {
  /* Suspense fallback handles failure */
}

/* ---------------- Error boundary ---------------- */

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    if (!ErrorBoundary._warned) {
      ErrorBoundary._warned = true;
      console.info(
        "[CarModel] GLB model not loaded — using procedural fallback. " +
          "Drop a model at /public/models/f1-car/ (see README.txt)."
      );
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
