import { useState, useEffect } from 'react';

async function checkAPI() {
  const response = await fetch('/api/');
  const text = await response.text();
  return text === "Node.js";
}

export function useInit() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      if (await checkAPI()) {
        global.nodeAPIBaseURL = '/api';
        global.fastAPIBaseURL = '/api/gpt';
        console.log("Using production setting.")
      } else {
        global.nodeAPIBaseURL = 'http://localhost:3001';
        global.fastAPIBaseURL = 'http://localhost:82';
        console.log("Using development setting.")
      }
      setIsInitialized(true);
    }

    init();
  }, []);

  return isInitialized;
}