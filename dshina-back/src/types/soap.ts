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
  login: string;
  password: string;
  filter: FindTyreFilter;
  page: number;
  pageSize?: number;
}