import { GoodsPriceRest } from "../markiAvto/api/types";

export type BasketItem = GoodsPriceRest & {
  quantity?: number;
};

export type BasketState = {
  basketArray: BasketItem[];
  loadingItems: Set<string>;
  isItemInBasket: (code: string) => boolean;
  setBasketArray: (item: GoodsPriceRest, quantity?: number) => boolean;
  deleteBasketArray: (code: string) => Promise<void>;
  isItemLoading: (code: string) => boolean;
  clearBasket: () => void;
};
