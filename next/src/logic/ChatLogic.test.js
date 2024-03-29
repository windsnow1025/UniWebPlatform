import {ChatLogic} from "./ChatLogic";

describe('processMessages', () => {
  it('should return a string', () => {
    const chatLogic = new ChatLogic();
    const message = [
      {
        "role":"system",
        "content":"You are a helpful assistant."
      },
      {
        "role":"user",
        "content":"Say this is a test."
      }
    ];
    const result = chatLogic.processMessages(message);
    expect(result).toStrictEqual(message);
  });

  it('should return a string', () => {
    const chatLogic = new ChatLogic();
    const message = [
      {
        "role":"system",
        "content":"You are a helpful assistant."
      },
      {
        "role":"user",
        "content":"What’s in this image?",
        "files": ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"]
      }
    ];
    const result = chatLogic.processMessages(message);
    const expected = [
      {
        "role":"system",
        "content":"You are a helpful assistant."
      },
      {
        "role":"user",
        "content":[
          {
            "type":"text",
            "text":"What’s in this image?"
          },
          {
            "type":"image_url",
            "image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
          }
        ]
      }
    ];
    expect(result).toStrictEqual(expected);
  });
});