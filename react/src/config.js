async function checkAPI() {
  const response = await fetch('/api');
  return response.text === "Node.js";
}

async function setAPIBaseURL() {
  if (await checkAPI()) {
    global.apiBaseUrl = '/api';
  } else {
    global.apiBaseUrl = 'http://localhost:3000';
  }
  console.log('API Base URL: ' + global.apiBaseUrl);
}

setAPIBaseURL();