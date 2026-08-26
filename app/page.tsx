"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Shoe } from "./components/shoe";
import { useRef, useState } from "react";
import * as THREE from "three";

const CAMERA_VIEWS: Record<
  string,
  [number, number, number, number, number, number]
> = {
  laces: [0, 0.8, -2.2, 0, 0.25, 0],
  sole: [-4, 1, -4, 0, 0, 0],
  caps: [0, 0.1, -2.4, 0, 0, 0],
  inner: [-2, 3, 3, 0, 0.25, 0],
  mesh: [-3, 0, -4, 0, 0, 0],
  band: [0, 0.1, -2.4, 0, 0, 0],
  stripes: [-5, 0, 0, 0, 0, 0],
  patch: [0, 1, 3, 0, 0.25, 0],
};

export default function Home() {
  const [selectedPart, setSelectedPart] = useState<string | null>("mesh");
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const handleSelectPart = (partName: string) => {
    setSelectedPart(partName);
    const targetView = CAMERA_VIEWS[partName];
    if (targetView && cameraControlsRef.current) {
      cameraControlsRef.current.setLookAt(...targetView, true);
    }
  };

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
              onSelectPart={handleSelectPart}
            />
            <Shoe
              position={[0.45, 0.1, 0]}
              rotation={[-Math.PI / 8, Math.PI / 2, 0]}
              scale={[1, 1, 1]}
              onSelectPart={handleSelectPart}
            />
          </group>
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.8}
            scale={7}
            blur={0.5}
            far={0.8}
          />
          <CameraControls ref={cameraControlsRef} makeDefault />
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
