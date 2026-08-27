import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface ShoeModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  partColors: Record<string, string>;
  onSelectPart: (partName: string) => void;
}

export function Shoe({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  partColors,
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
      <mesh
        geometry={nodes.shoe.geometry}
        material={materials.laces}
        material-color={partColors.laces}
      />
      <mesh
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color={partColors.mesh}
      />
      <mesh
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color={partColors.caps}
      />
      <mesh
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color={partColors.inner}
      />
      <mesh
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color={partColors.sole}
      />
      <mesh
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color={partColors.stripes}
      />
      <mesh
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color={partColors.band}
      />
      <mesh
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color={partColors.patch}
      />
    </group>
  );
}

useGLTF.preload("/models/shoe-draco.glb");
