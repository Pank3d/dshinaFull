import axios from "axios";
import { FindTyreParams, ResultFindTyre } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000/api";

export const findTyre = async (
  filter: FindTyreParams["filter"]
): Promise<ResultFindTyre> => {
  const response = await axios.post(`${baseUrl}/findTyre`, {
    filter,
  });
  return response.data;
};
