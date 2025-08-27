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
        // Добавляем в загрузку
        set((state) => ({
          loadingItems: new Set([...state.loadingItems, item.code])
        }));
        
        // Имитируем задержку
        setTimeout(() => {
          set((state) => {
            const newLoadingItems = new Set(state.loadingItems);
            newLoadingItems.delete(item.code);
            return {
              basketArray: [...state.basketArray, item],
              loadingItems: newLoadingItems
            };
          });
        }, 500);
      },
      
      isItemInBasket: (code: string): boolean => {
        return get().basketArray.some((i: GoodsPriceRest) => i.code === code);
      },
      
      isItemLoading: (code: string): boolean => {
        return get().loadingItems.has(code);
      },
      
      deleteBasketArray: async (code: string) => {
        // Добавляем в состояние загрузки
        set((state) => ({
          loadingItems: new Set([...state.loadingItems, code])
        }));
        
        // Имитируем задержку удаления
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set((state) => {
          console.log('Удаляем товар с кодом:', code);
          
          const newArray = state.basketArray.filter(
            (item: GoodsPriceRest) => item.code !== code
          );
          
          const newLoadingItems = new Set(state.loadingItems);
          newLoadingItems.delete(code);
          
          console.log('Товар удален');
          
          return { 
            basketArray: newArray,
            loadingItems: newLoadingItems
          };
        });
      },
    }),
    {
      name: "dshina-basket-storage",
      partialize: (state) => ({ basketArray: state.basketArray }),
    }
  )
);
