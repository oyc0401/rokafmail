import { create } from "zustand";
import createSelectors from "./selectors";

export const useStoreBase = create((set) => ({
  page: 1,
  next: () => {
    set((state) => ({ page: state.page + 1 }));
  },
  prev: () => set((state) => ({ page: state.page - 1 })),

  generation: "",
  name: "",
  birth: "",
  username: "",
  password: "",
  repassword: "",
  substring: "",

  setGeneration: (text) => set({ generation: text }),
  setName: (text) => set({ name: text }),
  setBirth: (text) => set({ birth: text }),
  setUsername: (text) => set({ username: text }),
  setPassword: (text) => set({ password: text }),
  setRepassword: (text) => set({ repassword: text }),
  setSubstring: (text) => set({ substring: text }),

  // generationHelp: { text: "예시) 850" },
  // nameHelp: { text: "" },
  // birthHelp: { text: "예시) 20020101" },
  // usernameHelp: { text: "" },
  // passwordHelp: { text: "" },
  // repasswordHelp: { text: "" },
  // substringHelp: { text: "" },

  // setGenerationHelp: (valid) => set({ generationHelp: valid }),
  // setNameHelp: (valid) => set({ nameHelp: valid }),
  // setBirthHelp: (valid) => set({ birthHelp: valid }),
  // setUsernameHelp: (valid) => set({ usernameHelp: valid }),
  // setPasswordHelp: (valid) => set({ passwordHelp: valid }),
  // setRepasswordHelp: (valid) => set({ repasswordHelp: valid }),
  // setSubstringHelp: (valid) => set({ substringHelp: valid }),

  // print() {
     
  // },
}));

export const useStore = createSelectors(useStoreBase);
