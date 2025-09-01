import axios from "axios";
import { GoodsDataResponse } from "./types";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";
const baseUrlTelegramm =
  process.env.NEXT_PUBLIC_BASE_URL_TELEGRAMSEND || "http://localhost:3001";

export const getMarkiAvto = async () => {
  const response = await axios.get(`${baseUrl}/markiAvto`);
  return response.data;
};

export const getModelAvto = async (marka: string) => {
  const response = await axios.post(`${baseUrl}/modelsAvto`, {
    marka,
  });
  return response.data;
};

export const getYearAvto = async (marka: string, model: string) => {
  const response = await axios.post(`${baseUrl}/yearAvto`, {
    marka,
    model,
  });
  return response.data;
};

export const getModificationAvto = async (
  marka: string,
  model: string,
  year_beg: number[],
  year_end: number[]
) => {
  const response = await axios.post(`${baseUrl}/modificationsAvto`, {
    marka,
    model,
    year_beg,
    year_end,
  });
  return response.data;
};

export const getGoodsByCar = async (
  marka: string,
  model: string,
  modification: string,
  year_beg: number[],
  year_end: number[],
  podbor_type?: number[],
  season_list?: string[],
  thom?: boolean,
  type?: string[],
  wh_list?: number[]
): Promise<GoodsDataResponse> => {
  const response = await axios.post(`${baseUrl}/goodsAvto`, {
    marka,
    model,
    modification,
    podbor_type,
    season_list,
    thom,
    type,
    wh_list,
    year_beg,
    year_end,
  });
  return response.data;
};

export const getWarehouses = async () => {
  const response = await axios.get(`${baseUrl}/warehouses`);
  return response.data;
};

export const getWarehousesByAddress = async (address_id: string) => {
  const response = await axios.post(`${baseUrl}/warehouses`, {
    address_id,
  });
  return response.data;
};

export const sendOrderToTelegram = async (orderData: {
  customerName: string;
  email: string;
  phone: string;
  telegram?: string;
  items: Array<{
    name: string;
    code: string;
    price: number;
    quantity: number;
    marka: string;
    model: string;
  }>;
  totalPrice: number;
}) => {
  const response = await axios.post(
    `${baseUrlTelegramm}/api/send-order`,
    orderData
  );
  return response.data;
};
