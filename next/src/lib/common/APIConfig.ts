import axios, {AxiosInstance} from 'axios';
import {Configuration as NestConfiguration} from "@/client/nest";
import {Configuration as FastAPIConfiguration} from "@/client/fastapi";
import {StorageKeys} from "@/lib/common/Constants";

export interface APIBaseURLs {
  nest: string;
  fastAPI: string;
}

export const defaultAPIBaseURLs: APIBaseURLs = {
  nest: process.env.NEXT_PUBLIC_NEST_API_BASE_URL!,
  fastAPI: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL!,
};

export function getAPIBaseURLs(): APIBaseURLs {
  const storedValue = localStorage.getItem(StorageKeys.APIBaseURLs);
  return storedValue ? JSON.parse(storedValue) : defaultAPIBaseURLs;
}

export function getNestAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: getAPIBaseURLs().nest
  });
}

export function getFastAPIAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: getAPIBaseURLs().fastAPI
  });
}

export function getNestOpenAPIConfiguration(): NestConfiguration {
  const token = localStorage.getItem(StorageKeys.Token);
  return new NestConfiguration({
    basePath: getAPIBaseURLs().nest,
    accessToken: token || undefined,
  });
}

export function getFastAPIOpenAPIConfiguration(): FastAPIConfiguration {
  const token = localStorage.getItem(StorageKeys.Token);
  return new FastAPIConfiguration({
    basePath: getAPIBaseURLs().fastAPI,
    accessToken: token || undefined,
  });
}
