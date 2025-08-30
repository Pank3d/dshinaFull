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
  price_rest_list?: TyreInfo[];
  totalPages?: number;
  warehouseLogistics?: any;
  error?: string;
}

export interface FindTyreParams {
  filter: FindTyreFilter;
  page?: number;
  pageSize?: number;
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
  { label: 'R13', value: "13" },
  { label: 'R14', value: "14" },
  { label: 'R15', value: "15" },
  { label: 'R16', value: "16" },
  { label: 'R17', value: "17" },
  { label: 'R18', value: "18" },
  { label: 'R19', value: "19" },
  { label: 'R20', value: "20" },
  { label: 'R21', value: "21" },
  { label: 'R22', value: "22" },
];