import { create } from "zustand";

type MediaState = {
  isMicOn: boolean;
  isCameraOn: boolean;
  setMic: (value: boolean) => void;
  setCamera: (value: boolean) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
};

export const useMediaStore = create<MediaState>((set) => ({
  isMicOn: true,
  isCameraOn: true,
  setMic: (value) => set({ isMicOn: value }),
  setCamera: (value) => set({ isCameraOn: value }),
  toggleMic: () => set((state) => ({ isMicOn: !state.isMicOn })),
  toggleCamera: () => set((state) => ({ isCameraOn: !state.isCameraOn })),
}));
