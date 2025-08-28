import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GoodsPriceRest } from "../markiAvto/api/types";

interface ProductsState {
  products: GoodsPriceRest[];
  setProducts: (products: GoodsPriceRest[]) => void;
  getProductByCode: (code: string) => GoodsPriceRest | undefined;
  clearProducts: () => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      
      setProducts: (products: GoodsPriceRest[]) => {
        set({ products });
      },
      
      getProductByCode: (code: string) => {
        return get().products.find(p => p.code === code);
      },
      
      clearProducts: () => {
        set({ products: [] });
      },
    }),
    {
      name: "dshina-products-storage",
    }
  )
);