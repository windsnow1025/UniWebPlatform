import './asset/css/App.css';

import MarkdownList from './component/MarkdownList';
import ThemeSelect from "./component/ThemeSelect";
import AuthDiv from "./component/AuthDiv";
import {ThemeProvider} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {getInitMUITheme} from "./logic/ThemeLogic";

function App() {
  const [theme, setTheme] = useState(getInitMUITheme());

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="Flex-space-around" style={{margin: 16}}>
          <AuthDiv/>
          <ThemeSelect/>
        </div>
        <div className="Flex-space-around" style={{margin: 16}}>
          <a href="/bookmark" target="_blank" rel="noopener noreferrer">Bookmarks</a>
          <a href="/message" target="_blank" rel="noopener noreferrer">Message Transmitter</a>
          <a href="/gpt" target="_blank" rel="noopener noreferrer">GPT</a>
        </div>
        <div className="Flex-space-around" style={{margin: 16}}>
          <MarkdownList/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
