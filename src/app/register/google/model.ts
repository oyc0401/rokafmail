import createSelectors from "src/lib/selectors";
import { create } from "zustand";

interface StoreState {
  page: number;
  generation: string;
  name: string;
  birth: string;
  username: string;
  message: string;
  reset: () => void;
  next: () => void;
  prev: () => void;
  setGeneration: (text: string) => void;
  setName: (text: string) => void;
  setBirth: (text: string) => void;
  setUsername: (text: string) => void;
  setMessage: (text: string) => void;
}

export const useStoreBase = create<StoreState>((set) => ({
  reset: () =>
    set({
      page: 0,
      generation: "",
      name: "",
      birth: "",
      username: "",
      message: "",
    }),

  page: 0,
  next: () => set((state) => ({ page: state.page + 1 })),
  prev: () => set((state) => ({ page: state.page - 1 })),

  generation: "",
  name: "",
  birth: "",
  username: "",
  message: "",

  setGeneration: (text) => set({ generation: text }),
  setName: (text) => set({ name: text }),
  setBirth: (text) => set({ birth: text }),
  setUsername: (text) => set({ username: text }),
  setMessage: (text) => set({ message: text }),
}));

export const useStore = createSelectors(useStoreBase);
