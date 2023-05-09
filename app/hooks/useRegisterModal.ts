import { create } from "zustand";

interface RegisterModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}; // This is the interface for the store that we will create with zustand and use in our components to manage the state of the modal. We will use this interface to define the type of the store. We will also use it to define the type of the hook that we will export from this file. The interface defines the state of the modal, which is whether it is open or closed. It also defines the functions that we will use to open and close the modal. We will use these functions to update the state of the modal. The interface also defines the type of the store that we will create with zustand. The store will be an object that has the same properties as the interface. The store will be used to manage the state of the modal. 

const useRegisterModal = create<RegisterModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useRegisterModal;