import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function RotatingMesh({ args, color, speed, rotationSpeed }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * rotationSpeed;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * (rotationSpeed * 0.5);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={args} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Starfield({ count = 200 }) {
  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Distribute stars in a spherical shell around the center
    const radius = 5 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#60a5fa"
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  );
}

function HologramOrb() {
  return (
    <Float
      speed={1.5}
      rotationIntensity={1.2}
      floatIntensity={2}
    >
      <group>
        {/* Outer Cyan Sphere */}
        <RotatingMesh
          args={[2.2, 2]}
          color="#06b6d4"
          rotationSpeed={0.12}
        />

        {/* Inner Emerald Sphere */}
        <RotatingMesh
          args={[1.6, 1]}
          color="#10b981"
          rotationSpeed={-0.18}
        />

        {/* Core Blue Sphere */}
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Background3D() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <HologramOrb />
        <Starfield count={180} />
      </Canvas>
    </div>
  );
}