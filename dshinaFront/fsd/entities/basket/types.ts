import { GoodsPriceRest } from "../markiAvto/api/types";

export type BasketState = {
  basketArray: GoodsPriceRest[];
  isItemInBasket: (code: string) => boolean;
  setBasketArray: (item: GoodsPriceRest) => void;
  deleteBasketArray: (code: number) => void;
}
