import axios, {AxiosInstance} from 'axios';
import {Configuration} from "@/client/nest";

export interface APIBaseURLs {
  nest: string;
  fastAPI: string;
}

export const defaultAPIBaseURLs: APIBaseURLs = {
  nest: process.env.NEXT_PUBLIC_NEST_API_BASE_URL!,
  fastAPI: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL!,
};

export function getAPIBaseURLs(): APIBaseURLs {
  const storedValue = localStorage.getItem("apiBaseURLs");
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

export function getNestOpenAPIConfiguration(): Configuration {
  const token = localStorage.getItem("token");
  return new Configuration({
    basePath: getAPIBaseURLs().nest,
    accessToken: token || undefined,
  });
}

export function getFastAPIOpenAPIConfiguration(): Configuration {
  const token = localStorage.getItem("token");
  return new Configuration({
    basePath: getAPIBaseURLs().fastAPI,
    accessToken: token || undefined,
  });
}
