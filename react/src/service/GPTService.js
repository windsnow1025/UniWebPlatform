import axios from 'axios';

export default class GPTService {

  constructor() {
    this.axiosInstance = axios.create({ baseURL: global.fastAPIBaseURL });
  }

  async generate(messages, api_type, model, temperature, stream) {
    const token = localStorage.getItem('token');

    const requestData = {
      messages: messages,
      api_type: api_type,
      model: model,
      temperature: temperature,
      stream: stream
    }

    if (!stream) {
      const res = await this.axiosInstance.post(`/`, requestData, {
          headers: {
            Authorization: token
          }
        }
      );

      return res.data;
    } else {
      const controller = new AbortController();
      const response = await fetch(`${global.fastAPIBaseURL}/`, {
        method: "POST",
        body: JSON.stringify(requestData),
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const reader = response.body.getReader();
      return {
        reader,
        controller
      };
    }
  }

}
