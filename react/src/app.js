import './App.css';

import MarkdownList from './component/MarkdownList';
import ThemeSelect from "./component/ThemeSelect";
import AuthDiv from "./component/AuthDiv";

function App() {
  return (
    <div className="App">
      <div className="Flex-space-around" style={{margin: "16px"}}>
        <AuthDiv />
        <ThemeSelect />
      </div>
      <div className="Flex-space-around" style={{margin: "16px"}}>
        <a href="./html/bookmarks.html">Bookmarks</a>
        <a href="./html/message-transmitter.html">Message Transmitter</a>
        <a href="./html/gpt.html">GPT</a>
      </div>
      <MarkdownList />
    </div>
  );
}

export default App;
