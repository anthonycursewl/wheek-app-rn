import { create } from "zustand";
import { StoreData } from "../entities/Store";

interface GlobalStore {
    currentStore: StoreData;
    setCurrentStore: (store: StoreData) => void;
    clearStore: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
    currentStore: {} as StoreData,
    setCurrentStore: (store: StoreData) => set({ currentStore: store }),
    clearStore: () => set({ currentStore: {} as StoreData })
}))