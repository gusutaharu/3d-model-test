"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Shoe } from "./components/shoe";

export default function Home() {
  return (
    <div className="canvasContainer w-full h-125 bg-gray-100">
      <Canvas camera={{ position: [-3, 0, -4], fov: 30 }}>
        <ambientLight intensity={1} />
        <Environment preset="city" />

        <group>
          <Shoe
            position={[-0.45, 0.1, 0]}
            rotation={[-Math.PI / 8, -Math.PI / 2, 0]}
            scale={[-1, 1, 1]}
          />
          <Shoe
            position={[0.45, 0.1, 0]}
            rotation={[-Math.PI / 8, Math.PI / 2, 0]}
            scale={[1, 1, 1]}
          />
        </group>
        <ContactShadows
          position={[0, -0.7, 0]} 
          opacity={.8}
          scale={7}
          blur={.5}
          far={0.8}
        />
        <CameraControls makeDefault />
      </Canvas>
    </div>
  );
}
