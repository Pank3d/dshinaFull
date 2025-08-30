import { useQuery } from "@tanstack/react-query";
import { findTyre } from "./api";
import { FindTyreFilter } from "./types";

export const useFindTyre = (
  filter: FindTyreFilter,
  page: number = 0,
  pageSize: number = 50,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["findTyre", filter, page, pageSize],
    queryFn: () => findTyre(filter, page, pageSize),
    enabled: enabled && Object.keys(filter).length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });
};