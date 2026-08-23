"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Shoe() {
  const { scene } = useGLTF("/models/shoe-draco.glb");
  return <primitive object={scene} />;
}

export default function Home() {
  return (
    <div className="canvasContainer">
      <Canvas>
        {/* 光がないと真っ黒になるためライトを追加 */}
        <ambientLight intensity={1} />
        {/* 球体の代わりに靴を表示 */}
        <Shoe />
      </Canvas>
    </div>
  );
}
