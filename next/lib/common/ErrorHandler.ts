import axios from "axios";

export function handleError(error: unknown, fallbackMessage: string): never {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const status = response.status;
      const statusText = response.statusText;
      const message = response.data.message;
      let finalMessage = "";
      if (status === 412) {
        finalMessage = "Please reload the resource."
      }
      throw new Error(`Error ${status} ${statusText}: ${message}. ${finalMessage}`)
    }
  }
  console.error(error);
  throw new Error(fallbackMessage);
}
