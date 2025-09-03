import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GoodsPriceRest } from "../markiAvto/api/types";
import { BasketState, BasketItem } from "./types";
import { getTotalRest } from "../../shared/utils/priceUtils";

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      basketArray: [],
      loadingItems: new Set<string>(),

      setBasketArray: (item: GoodsPriceRest, quantity: number = 1): boolean => {
        // Получаем текущий остаток товара
        const availableQuantity = getTotalRest(item);

        // Проверяем, есть ли товар в корзине
        const state = get();
        const existingItem = state.basketArray.find(
          (basketItem) => basketItem.code === item.code
        );
        const currentQuantityInBasket = existingItem?.quantity || 0;

        // Проверяем, не превышает ли запрашиваемое количество доступное
        if (currentQuantityInBasket + quantity > availableQuantity) {
          return false; // Не можем добавить - недостаточно товара
        }

        set((state) => ({
          loadingItems: new Set([...state.loadingItems, item.code]),
        }));

        set((state) => {
          const existingItemIndex = state.basketArray.findIndex(
            (basketItem) => basketItem.code === item.code
          );
          const newLoadingItems = new Set(state.loadingItems);
          newLoadingItems.delete(item.code);

          if (existingItemIndex >= 0) {
            // Если товар уже есть в корзине, увеличиваем количество
            const updatedArray = [...state.basketArray];
            updatedArray[existingItemIndex] = {
              ...updatedArray[existingItemIndex],
              quantity:
                (updatedArray[existingItemIndex].quantity || 1) + quantity,
            };
            return {
              basketArray: updatedArray,
              loadingItems: newLoadingItems,
            };
          } else {
            // Если товара нет в корзине, добавляем новый
            const newItem: BasketItem = { ...item, quantity };
            return {
              basketArray: [...state.basketArray, newItem],
              loadingItems: newLoadingItems,
            };
          }
        });

        return true; // Успешно добавлено
      },

      isItemInBasket: (code: string): boolean => {
        const state = get();
        if (!state || !state.basketArray || !Array.isArray(state.basketArray)) {
          return false;
        }
        return state.basketArray.some(
          (item: BasketItem) => item && item.code === code
        );
      },

      isItemLoading: (code: string): boolean => {
        const state = get();
        if (!state || !state.loadingItems) {
          return false;
        }
        return state.loadingItems.has(code);
      },

      deleteBasketArray: async (code: string) => {
        set((state) => ({
          loadingItems: new Set([...state.loadingItems, code]),
        }));

        set((state) => {
          if (!state.basketArray || !Array.isArray(state.basketArray)) {
            return state;
          }

          const newArray = state.basketArray.filter(
            (item: BasketItem) => item && item.code !== code
          );

          const newLoadingItems = new Set(state.loadingItems);
          newLoadingItems.delete(code);

          return {
            basketArray: newArray,
            loadingItems: newLoadingItems,
          };
        });
      },

      updateQuantity: (code: string, newQuantity: number): boolean => {
        if (newQuantity <= 0) {
          return false;
        }

        const state = get();
        const item = state.basketArray.find(
          (basketItem) => basketItem.code === code
        );

        if (!item) {
          return false;
        }

        // Получаем доступное количество товара
        const availableQuantity = getTotalRest(item);

        if (newQuantity > availableQuantity) {
          return false; // Не можем установить количество больше доступного
        }

        set((state) => {
          const updatedArray = state.basketArray.map((basketItem) =>
            basketItem.code === code
              ? { ...basketItem, quantity: newQuantity }
              : basketItem
          );

          return {
            ...state,
            basketArray: updatedArray,
          };
        });

        return true;
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
