import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { profile } from "../lib/data";

/**
 * Procedurally-built Mercedes-W-style F1 car — used as the fallback when
 * /public/models/f1-car.glb is missing or fails to load. See F1Car.jsx for
 * the GLB-first wrapper.
 */
export default function F1CarProcedural() {
  const group = useRef(null);

  // Very subtle idle hover so the car never feels frozen
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = -0.42 + Math.sin(t * 1.3) * 0.015;
  });

  return (
    <group ref={group} position={[0, -0.42, 0]} rotation={[0, -Math.PI / 14, 0]}>
      <Floor />
      <ChassisTub />
      <Sidepods />
      <EngineCoverWithSharkfin />
      <Cockpit />
      <Halo />
      <Nose />
      <FrontWing />
      <RearWing />
      <Wheels />
      <PetronasStripe />
      <LiveryDecals />
    </group>
  );
}

/* ----------------------------- Body parts ----------------------------- */

function Floor() {
  return (
    <mesh receiveShadow position={[0, 0.06, 0]}>
      <boxGeometry args={[4.0, 0.05, 1.05]} />
      <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

function ChassisTub() {
  return (
    <>
      {/* Main monocoque */}
      <mesh castShadow position={[0.1, 0.22, 0]}>
        <boxGeometry args={[2.4, 0.26, 0.62]} />
        <meshStandardMaterial color="#9da1a3" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Bevelled top edge to break the slab */}
      <mesh position={[0.1, 0.37, 0]}>
        <boxGeometry args={[2.35, 0.04, 0.7]} />
        <meshStandardMaterial color="#050505" metalness={0.6} roughness={0.4} />
      </mesh>
    </>
  );
}

function Sidepods() {
  return (
    <>
      {[-0.42, 0.42].map((z) => (
        <group key={z}>
          {/* Pod main body — tapered front */}
          <mesh castShadow position={[0.05, 0.34, z]}>
            <boxGeometry args={[1.8, 0.34, 0.22]} />
            <meshStandardMaterial color="#c0c4c6" metalness={0.78} roughness={0.28} />
          </mesh>
          {/* Inlet — gunmetal black notch on the front of pod */}
          <mesh position={[0.78, 0.36, z]}>
            <boxGeometry args={[0.32, 0.22, 0.18]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
          </mesh>
          {/* Undercut shadow line */}
          <mesh position={[0.05, 0.18, z * 1.02]}>
            <boxGeometry args={[1.75, 0.04, 0.06]} />
            <meshStandardMaterial color="#020202" />
          </mesh>
        </group>
      ))}
    </>
  );
}

function EngineCoverWithSharkfin() {
  return (
    <>
      {/* Engine cover — narrows toward rear */}
      <mesh castShadow position={[-0.55, 0.42, 0]}>
        <boxGeometry args={[1.2, 0.32, 0.4]} />
        <meshStandardMaterial color="#9da1a3" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Sharkfin — vertical blade running back from cockpit */}
      <mesh castShadow position={[-0.8, 0.74, 0]}>
        <boxGeometry args={[1.0, 0.36, 0.025]} />
        <meshStandardMaterial color="#c0c4c6" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Airbox above cockpit */}
      <mesh castShadow position={[-0.05, 0.66, 0]}>
        <boxGeometry args={[0.32, 0.18, 0.34]} />
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Airbox inlet ring */}
      <mesh position={[0.12, 0.66, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.13, 0.022, 12, 24]} />
        <meshStandardMaterial color="#00d2be" emissive="#00d2be" emissiveIntensity={0.4} />
      </mesh>
    </>
  );
}

function Cockpit() {
  return (
    <>
      {/* Cockpit floor — driver sits here */}
      <mesh position={[0.15, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.34]} />
        <meshStandardMaterial color="#020202" />
      </mesh>
      {/* Driver helmet stand-in — petronas teal */}
      <mesh castShadow position={[0.15, 0.62, 0]}>
        <sphereGeometry args={[0.13, 24, 16]} />
        <meshStandardMaterial
          color="#00d2be"
          metalness={0.4}
          roughness={0.35}
          emissive="#00d2be"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Helmet visor strip */}
      <mesh position={[0.245, 0.625, 0]}>
        <boxGeometry args={[0.015, 0.05, 0.22]} />
        <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}

function Halo() {
  return (
    <>
      {/* Halo main ring — front loop */}
      <mesh position={[0.15, 0.84, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.36, 0.022, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Halo center V strut */}
      <mesh position={[0.5, 0.78, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Halo rear attachment beams */}
      {[-0.32, 0.32].map((z) => (
        <mesh key={z} position={[-0.18, 0.84, z]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.04]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </>
  );
}

function Nose() {
  return (
    <>
      {/* Main nose box — long taper forward */}
      <mesh castShadow position={[1.45, 0.26, 0]}>
        <boxGeometry args={[1.0, 0.18, 0.28]} />
        <meshStandardMaterial color="#c0c4c6" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Nose tip — pointed front section */}
      <mesh castShadow position={[2.05, 0.22, 0]} rotation={[0, 0, -0.06]}>
        <coneGeometry args={[0.13, 0.45, 14]} />
        <meshStandardMaterial color="#c0c4c6" metalness={0.85} roughness={0.28} />
      </mesh>
      {/* Camera pod on top of nose */}
      <mesh position={[1.55, 0.38, 0]}>
        <boxGeometry args={[0.18, 0.07, 0.07]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </>
  );
}

function FrontWing() {
  return (
    <>
      {/* Main plane */}
      <mesh castShadow position={[2.2, 0.14, 0]}>
        <boxGeometry args={[0.32, 0.05, 1.5]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Upper flap — slightly higher and angled */}
      <mesh castShadow position={[2.15, 0.2, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.22, 0.03, 1.45]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Teal accent strip — leading edge */}
      <mesh position={[2.32, 0.165, 0]}>
        <boxGeometry args={[0.03, 0.018, 1.5]} />
        <meshStandardMaterial
          color="#00d2be"
          emissive="#00d2be"
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Endplates */}
      {[-0.78, 0.78].map((z) => (
        <mesh key={z} castShadow position={[2.18, 0.2, z]}>
          <boxGeometry args={[0.36, 0.18, 0.04]} />
          <meshStandardMaterial color="#c0c4c6" metalness={0.85} roughness={0.28} />
        </mesh>
      ))}
    </>
  );
}

function RearWing() {
  return (
    <>
      {/* Rear wing endplates */}
      {[-0.55, 0.55].map((z) => (
        <mesh key={z} castShadow position={[-1.7, 0.7, z]}>
          <boxGeometry args={[0.42, 0.55, 0.04]} />
          <meshStandardMaterial color="#c0c4c6" metalness={0.85} roughness={0.28} />
        </mesh>
      ))}
      {/* Main plane */}
      <mesh castShadow position={[-1.72, 0.92, 0]}>
        <boxGeometry args={[0.42, 0.05, 1.18]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* DRS flap — sits above main plane */}
      <mesh castShadow position={[-1.78, 1.0, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.3, 0.04, 1.16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Trailing teal edge */}
      <mesh position={[-1.92, 0.945, 0]}>
        <boxGeometry args={[0.02, 0.012, 1.2]} />
        <meshStandardMaterial
          color="#00d2be"
          emissive="#00d2be"
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* Rear central support pylon */}
      <mesh position={[-1.72, 0.78, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.06]} />
        <meshStandardMaterial color="#050505" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Diffuser */}
      <mesh position={[-1.95, 0.12, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.95]} />
        <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.6} />
      </mesh>
    </>
  );
}

function Wheels() {
  // [x, y, z] — front-left, front-right, rear-left, rear-right
  const positions = [
    [1.45, 0.32, 0.78],
    [1.45, 0.32, -0.78],
    [-1.35, 0.32, 0.78],
    [-1.35, 0.32, -0.78],
  ];
  return (
    <>
      {positions.map((p, i) => (
        <group key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
          {/* Tyre */}
          <mesh castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.32, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.92} metalness={0.05} />
          </mesh>
          {/* Tyre sidewall teal stripe — like soft compound marker */}
          <mesh position={[0, 0.165, 0]}>
            <torusGeometry args={[0.255, 0.012, 8, 24]} />
            <meshStandardMaterial
              color="#00d2be"
              emissive="#00d2be"
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Rim hub face */}
          <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.33, 24]} />
            <meshStandardMaterial color="#c0c4c6" metalness={0.95} roughness={0.12} />
          </mesh>
          {/* Center cap */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
            <meshStandardMaterial color="#00d2be" emissive="#00d2be" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function PetronasStripe() {
  return (
    <>
      {/* Central teal stripe running over nose, chassis, engine cover */}
      <mesh position={[0.5, 0.38, 0]}>
        <boxGeometry args={[3.2, 0.005, 0.06]} />
        <meshStandardMaterial
          color="#00d2be"
          emissive="#00d2be"
          emissiveIntensity={0.45}
        />
      </mesh>
      {/* Side accent stripe on each sidepod */}
      {[-0.42, 0.42].map((z) => (
        <mesh key={z} position={[0.05, 0.245, z * 1.04]}>
          <boxGeometry args={[1.4, 0.018, 0.005]} />
          <meshStandardMaterial
            color="#00d2be"
            emissive="#00d2be"
            emissiveIntensity={0.55}
          />
        </mesh>
      ))}
    </>
  );
}

function LiveryDecals() {
  return (
    <>
      {/* Initials on the sharkfin — both faces */}
      {[0.018, -0.018].map((z) => (
        <Text
          key={z}
          position={[-0.85, 0.78, z]}
          rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          fontSize={0.22}
          letterSpacing={0.04}
          fontWeight={900}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#00d2be"
        >
          {profile.initials}
        </Text>
      ))}

      {/* Race number on the nose */}
      {[-0.145, 0.145].map((z) => (
        <Text
          key={z}
          position={[1.42, 0.31, z]}
          rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          fontSize={0.18}
          fontWeight={900}
          color="#00d2be"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#050505"
        >
          {profile.number}
        </Text>
      ))}

      {/* Tagline on sidepod — both sides */}
      {[0.531, -0.531].map((z) => (
        <Text
          key={z}
          position={[0.05, 0.32, z]}
          rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          fontSize={0.07}
          letterSpacing={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {profile.name.toUpperCase()}
        </Text>
      ))}

      {/* Small KR on rear wing endplate */}
      {[-0.531, 0.531].map((z) => (
        <Text
          key={z}
          position={[-1.7, 0.7, z * 1.07]}
          rotation={[0, z > 0 ? 0 : Math.PI, 0]}
          fontSize={0.13}
          fontWeight={900}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {profile.initials}
        </Text>
      ))}
    </>
  );
}
