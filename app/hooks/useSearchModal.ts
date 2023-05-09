import { create } from "zustand";

interface SearchModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}; // login modal store interface for typescript type checking and intellisense support in IDE like VSCode and WebStorm etc. 

const useSearchModal = create<SearchModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useSearchModal;