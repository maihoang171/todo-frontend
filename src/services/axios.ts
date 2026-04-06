import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export function toArray<T>(t?: T | T[]): T[] {
  return Array.isArray(t) ? t : t ? [t] : [];
}

const baseURL = import.meta.env.VITE_BE_BASE_URL;
const defaultConfig: AxiosRequestConfig = {
  timeout: 60000,
  withCredentials: true,
  baseURL,
};


const createAxiosClient = (config: AxiosRequestConfig = defaultConfig) => {
  return axios.create({
    ...config,
    transformResponse: [
      ...toArray(axios.defaults.transformResponse),
    ],
    transformRequest: [
      ...toArray(axios.defaults.transformRequest),
    ],
  });
};

export const axiosClient = createAxiosClient();
