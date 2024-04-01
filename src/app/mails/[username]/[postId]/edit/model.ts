import { create } from "zustand";

interface State {
  initial: ({ name, relationship, title, contents }: {
    name: string;
    relationship: string;
    title: string;
    contents: string;
  }) => void;

  click: boolean;
  setClick: (click: boolean) => void;

  name: string;
  relationship: string;
  title: string;
  contents: string;
  password: string;

  setName: (text: string) => void;
  setRelationship: (text: string) => void;
  setTitle: (text: string) => void;
  setContents: (text: string) => void;
  setPassword: (text: string) => void;
}

export const useStore = create<State>((set) => ({
  // 수정 페이지 초기화
  initial: ({ name, relationship, title, contents }) =>
    set({ name, relationship, title, contents, password: "" }),

  click: false,
  setClick: (click) => set({ click: click }),

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
