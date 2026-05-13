import { create } from "zustand";

type Mode = "light" | "dark";

interface UIState {
  search: string;
  mode: Mode;

  setSearch: (value: string) => void;
  toggleMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  search: "",
  mode: "light",

  setSearch: (value) => set({ search: value }),

  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light"
    }))
}));