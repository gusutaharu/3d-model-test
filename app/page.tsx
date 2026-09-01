"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Shoe } from "./components/shoe";
import { useRef, useState } from "react";

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

const PARTS_LIST = [
  { id: "mesh", name: "メッシュ (全体)" },
  { id: "laces", name: "靴ひも" },
  { id: "sole", name: "ソール" },
  { id: "caps", name: "アイレット" },
  { id: "inner", name: "裏地" },
  { id: "band", name: "バンド" },
  { id: "stripes", name: "ストライプ" },
  { id: "patch", name: "パッチ" },
];

const COLOR_PALETTE = [
  { id: "white", hex: "#ffffff", name: "ホワイト" },
  { id: "black", hex: "#1a1a1a", name: "ブラック" },
  { id: "red", hex: "#e63946", name: "レッド" },
  { id: "blue", hex: "#1d3557", name: "ネイビー" },
  { id: "green", hex: "#2a9d8f", name: "グリーン" },
  { id: "yellow", hex: "#e9c46a", name: "イエロー" },
  { id: "orange", hex: "#f4a261", name: "オレンジ" },
];

export default function Home() {
  const [selectedPart, setSelectedPart] = useState<string | null>("mesh");
  const [partColors, setPartColors] = useState<Record<string, string>>({
    mesh: "#1d3557",
    laces: "#e9c46a",
    sole: "#e9c46a",
    caps: "#1a1a1a",
    inner: "#1d3557",
    band: "#2a9d8f",
    stripes: "#e9c46a",
    patch: "#e9c46a",
  });

  const [flashingPart, setFlashingPart] = useState<string | null>(null);
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const pendingFlashPartRef = useRef<string | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFlash = (partName: string) => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    setFlashingPart(partName);
    flashTimerRef.current = setTimeout(() => {
      setFlashingPart(null);
    }, 500);
  };

  const handleSelectPart = (partName: string) => {
    if (selectedPart === partName) return;

    setSelectedPart(partName);

    const targetView = CAMERA_VIEWS[partName];
    if (targetView && cameraControlsRef.current) {
      pendingFlashPartRef.current = partName;
      cameraControlsRef.current.setLookAt(...targetView, true);
    }
  };

  const handleCameraRest = () => {
    if (pendingFlashPartRef.current) {
      triggerFlash(pendingFlashPartRef.current);
      pendingFlashPartRef.current = null;
    }
  };

  const handleNavigate = (direction: number) => {
    const currentIndex = PARTS_LIST.findIndex(
      (part) => part.id === selectedPart,
    );
    const validIndex = currentIndex === -1 ? 0 : currentIndex;

    const nextIndex =
      (validIndex + direction + PARTS_LIST.length) % PARTS_LIST.length;

    handleSelectPart(PARTS_LIST[nextIndex].id);
  };

  const handleColorChange = (color: string) => {
    if (!selectedPart) return;
    setPartColors((prev) => ({
      ...prev,
      [selectedPart]: color,
    }));
  };

  const currentPartObject = PARTS_LIST.find((part) => part.id === selectedPart);

  const currentIndex = PARTS_LIST.findIndex((part) => part.id === selectedPart);
  const currentNumber = currentIndex !== -1 ? currentIndex + 1 : 1;
  const totalCount = PARTS_LIST.length;

  return (
    <>
      <div className="canvasContainer w-full h-150 bg-gray-100">
        <Canvas camera={{ position: [-3, 0, -4], fov: 30 }}>
          <ambientLight intensity={1} />
          <Environment preset="city" />

          <group>
            <Shoe
              position={[-0.45, 0.1, 0]}
              rotation={[-Math.PI / 8, -Math.PI / 2, 0]}
              scale={[-1, 1, 1]}
              onSelectPart={handleSelectPart}
              partColors={partColors}
              flashingPart={flashingPart}
            />
            <Shoe
              position={[0.45, 0.1, 0]}
              rotation={[-Math.PI / 8, Math.PI / 2, 0]}
              scale={[1, 1, 1]}
              onSelectPart={handleSelectPart}
              partColors={partColors}
              flashingPart={flashingPart}
            />
          </group>
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.8}
            scale={7}
            blur={0.5}
            far={0.8}
          />
          <CameraControls
            ref={cameraControlsRef}
            makeDefault
            smoothTime={0.3}
            onRest={handleCameraRest}
          />
        </Canvas>
      </div>
      <div className="p-8 flex flex-col items-center justify-center gap-6">
        <div className="flex">
          <button onClick={() => handleNavigate(-1)} aria-label="前の部位へ">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              role="img"
              width="24px"
              height="24px"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M11.021 18.967L4.055 12l6.966-6.967M4 12h17"
              ></path>
            </svg>
          </button>
          <div className="min-w-95 text-center">
            <p className="text-xl text-[#111111]">
              {currentPartObject ? currentPartObject.name : selectedPart}{" "}
              <span className="font-normal text-[#757575]">
                {currentNumber}/{totalCount}
              </span>
            </p>
          </div>
          <button onClick={() => handleNavigate(1)} aria-label="次の部位へ">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              role="img"
              width="24px"
              height="24px"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                d="M12.979 18.967L19.945 12 12.98 5.033M20 12H3"
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <div className="mt-8 flex items-center justify-center gap-4">
            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedPart
                ? partColors[selectedPart] === color.hex
                : false;
              return (
                <div key={color.id} className="m-2 text-center">
                  <button
                    onClick={() => handleColorChange(color.hex)}
                    className={`w-8 h-8 rounded-full border border-gray-300 transition-all ${
                      isSelected ? "ring-1 ring-offset-3" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                  <div className="text-xs mt-2">{color.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
