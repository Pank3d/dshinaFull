// Ответ по шинам

interface CurrencyRate {
  charCode: string;
  nominal: number;
  numCode: number;
  value: number;
}

interface WarehousePriceRest {
  price: number;
  price_rozn: number;
  rest: number;
  wrh: number;
}

export interface GoodsPriceRest {
  code: string;
  color: string;
  img_big_my: string;
  img_big_pish: string;
  img_small: string;
  marka: string;
  model: string;
  name: string;
  thorn: boolean;
  type: string;
  whpr: {
    wh_price_rest: WarehousePriceRest[];
  };
}

export interface WarehouseInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
  work_time: string;
}

export interface GoodsDataResponse {
  currencyRate: CurrencyRate;
  price_rest_list: {
    goods_price_rest: GoodsPriceRest[];
  };
}
