import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GoodsPriceRest } from "../markiAvto/api/types";
import { BasketState } from "./types";

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      basketArray: [],
      loadingItems: new Set<string>(),

      setBasketArray: (item: GoodsPriceRest) => {
        set((state) => ({
          loadingItems: new Set([...state.loadingItems, item.code]),
        }));

        set((state) => {
          const newLoadingItems = new Set(state.loadingItems);
          newLoadingItems.delete(item.code);
          return {
            basketArray: [...state.basketArray, item],
            loadingItems: newLoadingItems,
          };
        });
      },

      isItemInBasket: (code: string): boolean => {
        return get().basketArray.some((i: GoodsPriceRest) => i.code === code);
      },

      isItemLoading: (code: string): boolean => {
        return get().loadingItems.has(code);
      },

      deleteBasketArray: async (code: string) => {
        set((state) => ({
          loadingItems: new Set([...state.loadingItems, code]),
        }));

        set((state) => {
          console.log("Удаляем товар с кодом:", code);

          const newArray = state.basketArray.filter(
            (item: GoodsPriceRest) => item.code !== code
          );

          const newLoadingItems = new Set(state.loadingItems);
          newLoadingItems.delete(code);

          console.log("Товар удален");

          return {
            basketArray: newArray,
            loadingItems: newLoadingItems,
          };
        });
      },

      clearBasket: () => {
        set(() => ({
          basketArray: [],
          loadingItems: new Set<string>(),
        }));
      },
    }),
    {
      name: "dshina-basket-storage",
      partialize: (state) => ({ basketArray: state.basketArray }),
    }
  )
);
