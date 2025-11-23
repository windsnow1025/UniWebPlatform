import axios from "axios";

export function handleError(error: unknown, fallbackMessage: string): never {
  if (axios.isAxiosError(error)) {
    throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
  }
  console.error(error);
  throw new Error(fallbackMessage);
}
