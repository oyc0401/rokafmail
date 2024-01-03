import { create } from "zustand";
import createSelectors from "./selectors";

export const useStoreBase = create((set) => ({
  page: 0,
  next: () => set((state) => ({ page: state.page + 1 })),
  prev: () => set((state) => ({ page: state.page - 1 })),

  generation: "",
  name: "",
  birth: "",
  username: "",
  password: "",
  repassword: "",
  message: "",

  setGeneration: (text) => set({ generation: text }),
  setName: (text) => set({ name: text }),
  setBirth: (text) => set({ birth: text }),
  setUsername: (text) => set({ username: text }),
  setPassword: (text) => set({ password: text }),
  setRepassword: (text) => set({ repassword: text }),
  setMessage: (text) => set({ message: text }),
}));

export const useStore = createSelectors(useStoreBase);
