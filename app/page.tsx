"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, ContactShadows, Environment } from "@react-three/drei";
import { Shoe } from "./components/shoe";
import { useRef, useState } from "react";
import { RiShare2Line } from "react-icons/ri";
import { SlMenu } from "react-icons/sl";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import { HiArrowRight } from "react-icons/hi2";
import { HiArrowLeft } from "react-icons/hi2";
import { RiCloseLargeLine } from "react-icons/ri";

const CAMERA_VIEWS: Record<
  string,
  [number, number, number, number, number, number]
> = {
  laces: [0, 0.8, -2.2, 0, 0.25, 0],
  sole: [-4, 1, -3, 0, 0, 0],
  caps: [0, 0.1, -2.4, 0, 0, 0],
  inner: [-2, 2, 2, 0, 0, 0.2],
  mesh: [-3, 2, -3, 0, 0, 0],
  band: [0, 0.1, -3, 0, 0, 0],
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
  { id: "black", hex: "#1a1a1a", name: "ブラック" },
  { id: "white", hex: "#ffffff", name: "ホワイト" },
  { id: "red", hex: "#e63946", name: "レッド" },
  { id: "blue", hex: "#1d3557", name: "ネイビー" },
  { id: "green", hex: "#2a9d8f", name: "グリーン" },
  { id: "yellow", hex: "#e9c46a", name: "イエロー" },
  { id: "orange", hex: "#f4a261", name: "オレンジ" },
];

const PRODUCT_NAME = "スニーカー";
const PRODUCT_PRICE = "10,000";

const DEFAULT_PART_COLORS = {
  mesh: "#1d3557",
  laces: "#e9c46a",
  sole: "#e9c46a",
  caps: "#1a1a1a",
  inner: "#1d3557",
  band: "#2a9d8f",
  stripes: "#e9c46a",
  patch: "#e9c46a",
};

export default function Home() {
  const [selectedPart, setSelectedPart] = useState<string | null>("mesh");
  const [partColors, setPartColors] =
    useState<Record<string, string>>(DEFAULT_PART_COLORS);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      <div
        className={`canvasContainer w-full transition-all duration-300 relative bg-gray-100 ${isExpanded ? "h-[90vh]" : "h-150"}`}
      >
        <div className="absolute top-0 left-0 z-10 px-5 py-11 flex justify-between w-full">
          <div className="flex flex-col pl-6">
            <span>{PRODUCT_NAME}</span>
            <span>¥{PRODUCT_PRICE}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200"
              aria-label="共有"
            >
              <RiShare2Line className="h-6 w-6" />
            </button>
            <button className="px-6 py-2 rounded-full border border-gray-200 font-bold">
              完了
            </button>
          </div>
        </div>
        <Canvas camera={{ position: [-3, 2, -3], fov: 30 }}>
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
            minDistance={3}
            maxDistance={7}
            makeDefault
            smoothTime={0.3}
            onRest={handleCameraRest}
          />
        </Canvas>
      </div>
      <div
        className={`transition-all duration-300 fixed inset-0 z-20 backdrop-blur-xs bg-black/20 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`transition-all duration-300 fixed bottom-0 z-30 bg-white flex flex-col gap-6 w-full ${isOpen ? "h-[60vh]" : isExpanded ? "h-[11vh]" : "h-[27vh]"} `}
      >
        <nav className={`${isOpen ? "" : "hidden"}`}>
          <div className="py-10 pr-10 pl-40">
            <div className="flex items-center  text-2xl">
              <p className="font-bold">コンポーネンツ</p>
              <span className="ml-2 text-gray-400">{PARTS_LIST.length}</span>
              <button
                className="ml-auto flex items-center justify-center w-10 h-10 border rounded-full border-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <RiCloseLargeLine />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-10 pt-10">
              {PARTS_LIST.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center gap-4 hover:cursor-pointer"
                  onClick={() => {
                    handleSelectPart(part.id);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className="p-1 h-1 w-1 inline-block rounded-full"
                    style={{ backgroundColor: partColors[part.id] }}
                  />
                  <p className="font-bold">{part.name}</p>
                </div>
              ))}
            </div>
          </div>
        </nav>
        <div className={`px-12 py-6 ${isOpen ? "hidden" : ""}`}>
          <div className={`grid grid-cols-3 items-center w-full min-w-0`}>
            <div className="justify-self-start">
              <button
                className="flex items-center justify-center w-10 h-10 border rounded-full border-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <SlArrowUp className=" h-4 w-4 " />
                ) : (
                  <SlArrowDown className=" h-4 w-4 " />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() => handleNavigate(-1)}
                aria-label="前の部位へ"
              >
                <HiArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-full min-w-64 max-w-98 text-center">
                <p className="text-xl text-[#111111]">
                  {currentPartObject ? currentPartObject.name : selectedPart}{" "}
                  <span className="font-normal text-[#757575]">
                    {currentNumber}/{totalCount}
                  </span>
                </p>
              </div>
              <button onClick={() => handleNavigate(1)} aria-label="次の部位へ">
                <HiArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="justify-self-end">
              <button
                className="flex items-center gap-2 px-6 py-2 border rounded-full border-gray-200 font-bold"
                onClick={() => setIsOpen(true)}
              >
                <SlMenu className="h-5 w-5" />
                メニュー
              </button>
            </div>
          </div>
          <div className={`${isExpanded || isOpen ? "hidden" : ""}`}>
            <div className="mt-10 flex items-center justify-center gap-4">
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
                    <div
                      className={`text-xs mt-2  ${isSelected ? "opacity-100" : "opacity-0"}`}
                    >
                      {color.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
