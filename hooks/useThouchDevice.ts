import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  const media = window.matchMedia("(pointer: coarse)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia("(pointer: coarse)").matches;
const getServerSnapshot = () => false;

export function useIsTouchDevice() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
