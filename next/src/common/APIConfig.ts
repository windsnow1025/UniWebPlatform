import axios, {AxiosInstance} from 'axios';

export interface APIBaseURLs {
  nest: string;
  fastAPI: string;
}

export const defaultAPIBaseURLs = {
  nest: process.env.NEXT_PUBLIC_NEST_API_BASE_URL,
  fastAPI: process.env.NEXT_PUBLIC_FASTAPI_API_BASE_URL,
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

export function getNestAxiosInstance() {
  if (!nestAxiosInstance) {
    nestAxiosInstance = axios.create({
      baseURL: getAPIBaseURLs().nest
    });
  }
  return nestAxiosInstance;
}

export function getFastAPIAxiosInstance() {
  if (!fastAPIAxiosInstance) {
    fastAPIAxiosInstance = axios.create({
      baseURL: getAPIBaseURLs().fastAPI
    });
  }
  return fastAPIAxiosInstance;
}