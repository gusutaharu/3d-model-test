import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export interface ShoeModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  partColors: Record<string, string>;
  onSelectPart: (partName: string) => void;
  flashingPart?: string | null;
}

const FLASH_COLOR = "#ffffff";

export function Shoe({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  partColors,
  onSelectPart,
  flashingPart,
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

  const getColor = (partName: string) => {
    return flashingPart === partName
      ? FLASH_COLOR
      : partColors[partName] || "#ffffff";
  };
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
        material-color={getColor("laces")}
      />
      <mesh
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color={getColor("mesh")}
      />
      <mesh
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color={getColor("caps")}
      />
      <mesh
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color={getColor("inner")}
      />
      <mesh
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color={getColor("sole")}
      />
      <mesh
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color={getColor("stripes")}
      />
      <mesh
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color={getColor("band")}
      />
      <mesh
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color={getColor("patch")}
      />
    </group>
  );
}

useGLTF.preload("/models/shoe-draco.glb");
