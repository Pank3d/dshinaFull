import { GoodsPriceRest } from "../../markiAvto/api/types";

export interface FindTyreFilter {
  season_list?: string[];
  width_min?: number;
  width_max?: number;
  height_min?: number;
  height_max?: number;
  diameter_min?: number;
  diameter_max?: number;
  brand_list?: string[];
  model_list?: string[];
  runflat?: boolean;
  om?: boolean;
  price_min?: number;
  price_max?: number;
  wh_list?: number[];
  in_stock?: boolean;
  podbor_type?: number[];
  thom?: boolean;
  type?: string[];
  speed_index?: string;
  min_stock?: number;
}

export interface TyreInfo {
  id: string;
  brand: string;
  model: string;
  width: number;
  height: number;
  diameter: number;
  season: string;
  runflat: boolean;
  om: boolean;
  price: number;
  count: number;
  warehouse_id: number;
  description?: string;
  image_url?: string;
}

export interface ResultFindTyre {
  currencyRate?: string;
  price_rest_list?: {
    TyrePriceRest: GoodsPriceRest[];
  };
  totalPages?: number;
  warehouseLogistics?: any;
  error?: string;
}

export interface FindTyreParams {
  filter: FindTyreFilter;
}

// Опции для селектов
export const SEASON_OPTIONS = [
  { label: "Летние", value: "summer" },
  { label: "Зимние", value: "winter" },
  { label: "Всесезонные", value: "all-season" },
];

export const WIDTH_OPTIONS = [
  { label: "155", value: "155" },
  { label: "165", value: "165" },
  { label: "175", value: "175" },
  { label: "185", value: "185" },
  { label: "195", value: "195" },
  { label: "205", value: "205" },
  { label: "215", value: "215" },
  { label: "225", value: "225" },
  { label: "235", value: "235" },
  { label: "245", value: "245" },
  { label: "255", value: "255" },
  { label: "265", value: "265" },
  { label: "275", value: "275" },
  { label: "285", value: "285" },
  { label: "295", value: "295" },
];

export const HEIGHT_OPTIONS = [
  { label: "30", value: "30" },
  { label: "35", value: "35" },
  { label: "40", value: "40" },
  { label: "45", value: "45" },
  { label: "50", value: "50" },
  { label: "55", value: "55" },
  { label: "60", value: "60" },
  { label: "65", value: "65" },
  { label: "70", value: "70" },
  { label: "75", value: "75" },
  { label: "80", value: "80" },
];

export const DIAMETER_OPTIONS = [
  { label: "R13", value: "13" },
  { label: "R14", value: "14" },
  { label: "R15", value: "15" },
  { label: "R16", value: "16" },
  { label: "R17", value: "17" },
  { label: "R18", value: "18" },
  { label: "R19", value: "19" },
  { label: "R20", value: "20" },
  { label: "R21", value: "21" },
  { label: "R22", value: "22" },
];

// Опции для шипованности (для зимних шин)
export const STUDDED_OPTIONS = [
  { label: "Шипованная", value: "true" },
  { label: "Нешипованная", value: "false" },
];

// Индексы скорости
export const SPEED_INDEX_OPTIONS = [
  { label: "H (210 км/ч)", value: "H" },
  { label: "V (240 км/ч)", value: "V" },
  { label: "W (270 км/ч)", value: "W" },
  { label: "Y (300 км/ч)", value: "Y" },
  { label: "Z (свыше 240 км/ч)", value: "Z" },
  { label: "T (190 км/ч)", value: "T" },
  { label: "S (180 км/ч)", value: "S" },
  { label: "R (170 км/ч)", value: "R" },
  { label: "Q (160 км/ч)", value: "Q" },
  { label: "P (150 км/ч)", value: "P" },
  { label: "N (140 км/ч)", value: "N" },
  { label: "M (130 км/ч)", value: "M" },
  { label: "L (120 км/ч)", value: "L" },
];
