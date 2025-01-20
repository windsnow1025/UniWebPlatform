import {getFastAPIAxiosInstance} from "@/src/common/APIConfig";

export default class ImageClient {
  async generate(
    prompt: string,
    model: string,
    size: string,
    quality: string,
    n: number
  ): Promise<string[]> {
    const token = localStorage.getItem('token')!;

    const requestData = {
      prompt: prompt,
      model: model,
      size: size,
      quality: quality,
      n: n
    }

    const res = await getFastAPIAxiosInstance().post('/image-gen', requestData, {
      headers: {Authorization: token}
    });
    return res.data;
  }

}
