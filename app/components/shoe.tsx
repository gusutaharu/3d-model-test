import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface ShoeModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onSelectPart: (partName: string) => void;
}

export function Shoe({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  onSelectPart,
}: ShoeModelProps) {
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
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e: {
        stopPropagation: () => void;
        object: { material?: { name: string } };
      }) => {
        e.stopPropagation();
        const clickedMaterialName = e.object.material?.name;
        if (clickedMaterialName) {
          onSelectPart(clickedMaterialName);
        }
      }}
    >
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

useGLTF.preload("/models/shoe-draco.glb");
