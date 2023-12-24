import { useState, useEffect } from 'react';

async function checkAPI() {
  const response = await fetch('/api');
  const text = await response.text();
  return text === "Node.js";
}

export function useInit() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      if (await checkAPI()) {
        global.apiBaseUrl = '/api';
      } else {
        global.apiBaseUrl = 'http://localhost:3000';
      }
      console.log('API Base URL: ' + global.apiBaseUrl);
      setIsInitialized(true);
    }

    init();
  }, []);

  return isInitialized;
}