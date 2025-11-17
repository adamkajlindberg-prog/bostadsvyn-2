import { create } from 'zustand';

type T_Modal = {
  modal: string | null;
  secondModal: string | null;
  setModal: (modal: string | null) => void;
  setSecondModal: (secondModal: string | null) => void;
};

export const useModalStore = create<T_Modal>((set) => ({
  modal: null,
  secondModal: null,
  setModal: (modal) => set({ modal }),
  setSecondModal: (secondModal) => set({ secondModal }),
}));
