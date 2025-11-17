import { create } from 'zustand';

type T_Select_Image = {
  selectedImage: number;
  setSelectedImage: (index: number) => void;
};

export const useSelectImageStore = create<T_Select_Image>((set) => ({
    selectedImage: 1,
    setSelectedImage: (value) => set({ selectedImage: value })
}))