import { create } from "zustand";

export const useStore = create((set) => ({
  click: false,
  setClick: (click) => set({ click: event }),

  name: "",
  relationship: "",
  title: "",
  contents: "",
  password: "",

  setName: (text) => set({ name: text }),
  setRelationship: (text) => set({ relationship: text }),
  setTitle: (text) => set({ title: text }),
  setContents: (text) => set({ contents: text }),
  setPassword: (text) => set({ password: text }),
}));
