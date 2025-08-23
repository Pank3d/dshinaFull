import { create } from "zustand";
import { GoodsPriceRest } from "../markiAvto/api/types";
import { BasketState } from "./types";

export const useBasketStore = create<BasketState>((set, get) => ({
  basketArray: [],
  setBasketArray: (item: GoodsPriceRest) =>
    set((state: { basketArray: GoodsPriceRest[] }) => ({
      basketArray: [...state.basketArray, item],
    })),
  isItemInBasket: (code: string): boolean => {
    return get().basketArray.some((i: GoodsPriceRest) => i.code === code);
  },
  deleteBasketArray: (code: number) =>
    set((state: { basketArray: GoodsPriceRest[] }) => ({
      basketArray: state.basketArray.filter(
        (item: GoodsPriceRest) => Number(item.code) !== Number(code)
      ),
    })),
}));
