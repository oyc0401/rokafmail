import { create } from "zustand";
import createSelectors from "./selectors";

type State = {
  bears: number;
};

type Action = {
  increase: (by: number) => void;
  removeAllBears: () => void;
};

const useStoreBase = create<State & Action>()((set) => ({
  bears: 0,
  increase() {
    set((state) => ({ bears: state.bears + 1 }));
  },
  removeAllBears() {
    set({ bears: 0 });
  },
}));

export const useStore = createSelectors(useStoreBase);
