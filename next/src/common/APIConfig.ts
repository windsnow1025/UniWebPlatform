import axios, {AxiosInstance} from 'axios';
import {Configuration} from "@/client";

export interface APIBaseURLs {
  nest: string;
  fastAPI: string;
}

export const defaultAPIBaseURLs: APIBaseURLs = {
  nest: process.env.NEXT_PUBLIC_NEST_API_BASE_URL!,
  fastAPI: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL!,
};

let apiBaseURLs: APIBaseURLs;
let nestAxiosInstance: AxiosInstance;
let fastAPIAxiosInstance: AxiosInstance;

export function getAPIBaseURLs(): APIBaseURLs {
  if (!apiBaseURLs) {
    const storedValue = localStorage.getItem("apiBaseURLs");
    apiBaseURLs = storedValue ? JSON.parse(storedValue) : defaultAPIBaseURLs;
  }
  return apiBaseURLs;
}

export function getNestAxiosInstance(): AxiosInstance {
  if (!nestAxiosInstance) {
    nestAxiosInstance = axios.create({
      baseURL: getAPIBaseURLs().nest
    });
  }
  return nestAxiosInstance;
}

export function getFastAPIAxiosInstance(): AxiosInstance {
  if (!fastAPIAxiosInstance) {
    fastAPIAxiosInstance = axios.create({
      baseURL: getAPIBaseURLs().fastAPI
    });
  }
  return fastAPIAxiosInstance;
}

export function getOpenAPIConfiguration(): Configuration {
  const token = localStorage.getItem("token");
  return new Configuration({
    basePath: getAPIBaseURLs().nest,
    baseOptions: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });
}
