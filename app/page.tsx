"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Shoe } from "./components/shoe";
import { useState } from "react";
export default function Home() {
  const [selectedPart, setSelectedPart] = useState<string | null>("laces");
  return (
    <>
      <div className="canvasContainer w-full h-125 bg-gray-100">
        <Canvas camera={{ position: [-3, 0, -4], fov: 30 }}>
          <ambientLight intensity={1} />
          <Environment preset="city" />

          <group>
            <Shoe
              position={[-0.45, 0.1, 0]}
              rotation={[-Math.PI / 8, -Math.PI / 2, 0]}
              scale={[-1, 1, 1]}
              onSelectPart={(partName) => setSelectedPart(partName)}
            />
            <Shoe
              position={[0.45, 0.1, 0]}
              rotation={[-Math.PI / 8, Math.PI / 2, 0]}
              scale={[1, 1, 1]}
              onSelectPart={(partName) => setSelectedPart(partName)}
            />
          </group>
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.8}
            scale={7}
            blur={0.5}
            far={0.8}
          />
          <CameraControls makeDefault />
        </Canvas>
      </div>
      <div className="p-8">
        <p className="text-xl font-bold text-[#111111] text-center">
          <span>{selectedPart}</span>
        </p>
      </div>
    </>
  );
}
