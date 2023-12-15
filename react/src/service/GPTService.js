import axios from 'axios';

export default class GPTService {

  async generate(messages, api_type, model, temperature, stream) {
    const token = localStorage.getItem('token');

    if (!stream) {
      const res = await axios.post("/api/gpt/", {
          messages: messages,
          api_type: api_type,
          model: model,
          temperature: temperature,
          stream: stream
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return res.data;
    }
  }


}
