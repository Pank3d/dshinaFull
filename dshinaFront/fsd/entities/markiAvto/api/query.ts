import { useQuery, useMutation } from "@tanstack/react-query";
import { getGoodsByCar, getMarkiAvto, getModelAvto, getModificationAvto, getWarehouses, getWarehousesByAddress, getYearAvto, sendOrderToTelegram } from "./api";

export const useGetMarkaAvto = () => {
  return useQuery({
    queryKey: ["marki"],
    queryFn: getMarkiAvto,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};


export const useGetWarehouses = () => {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: getWarehouses,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetWarehousesByAddress = (address_id: string) => {
  return useQuery({
    queryKey: ["warehouses", address_id],
    queryFn: () => getWarehousesByAddress(address_id),
    enabled: !!address_id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useGetModelAvto = (marka: string) => {
  return useQuery({
    queryKey: ["model", marka],
    queryFn: () => getModelAvto(marka),
    enabled: !!marka,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};


export const useGetYearAvto = (marka: string, model: string) => {
  return useQuery({
    queryKey: ["year", marka, model],
    queryFn: () => getYearAvto(marka, model),
    enabled: !!marka && !!model,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};


export const useGetModificationAvto = (marka: string, model: string, year_beg: number[], year_end: number[]) => {
  return useQuery({
    queryKey: ["modification", marka, model, year_beg, year_end],
    queryFn: () => getModificationAvto(marka, model, year_beg, year_end),
    enabled: !!marka && !!model && !!year_beg && !!year_end,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};


export const useGetGoodsByCar = (
  marka: string,
  model: string,
  modification: string,
  year_beg: number[],
  year_end: number[],
  podbor_type?: number[],
  season_list?: string[],
  thom?: boolean,
  type?: string[],
  wh_list?: number[],
) => {
  const isEnabled = Boolean(
    marka && model && modification && year_beg && year_end
  );

  return useQuery({
    queryKey: ["goods", marka, model, modification, year_beg, year_end, podbor_type, season_list, thom, type, wh_list],
    queryFn: () => getGoodsByCar(marka, model, modification, year_beg, year_end, podbor_type, season_list, thom, type, wh_list),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useSendOrderToTelegram = (
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: sendOrderToTelegram,
    onSuccess: (data) => {
      console.log('Order sent successfully:', data);
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Failed to send order:', error);
      onError?.(error);
    },
  });
};
