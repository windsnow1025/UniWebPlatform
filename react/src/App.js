import './asset/css/App.css';

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
        <a href="/bookmark">Bookmarks</a>
        <a href="/message">Message Transmitter</a>
        <a href="./html/gpt.html">GPT</a>
      </div>
      <div className="Flex-space-around" style={{margin: "16px"}}>
        <MarkdownList />
      </div>
    </div>
  );
}

export default App;
