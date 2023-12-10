import './App.css';

import MarkdownList from './components/MarkdownList';

function App() {
  return (
    <div className="App">
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
