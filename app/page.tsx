"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Shoe() {
  type GLTFResult = {
    nodes: {
      [key: string]: THREE.Mesh;
    };
    materials: {
      [key: string]: THREE.MeshStandardMaterial;
    };
  };
  const { nodes, materials } = useGLTF(
    "models/shoe-draco.glb",
  ) as unknown as GLTFResult;
  console.log("Nodes (パーツ一覧):", nodes);
  console.log("Materials (マテリアル一覧):", materials);
  return (
    <group>
      <mesh geometry={nodes.shoe.geometry} material={materials.laces} />
      <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} />
      <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} />
      <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} />
      <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} />
      <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} />
      <mesh geometry={nodes.shoe_6.geometry} material={materials.band} />
      <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} />
    </group>
  );
}

export default function Home() {
  return (
    <div className="canvasContainer">
      <Canvas>
        <ambientLight intensity={1} />
        <Shoe />
      </Canvas>
    </div>
  );
}
