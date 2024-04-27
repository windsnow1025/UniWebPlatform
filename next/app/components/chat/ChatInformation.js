import React from 'react';
import LinkIcon from "@mui/icons-material/Link";
import CreditDiv from "../message/CreditDiv";

function ChatInformation({ messages }) {
  return (
    <div className="flex-around m-2">
      <a href="/markdown/view/chat-doc.md" target="_blank" rel="noopener noreferrer">
        <div className="flex-center">
          <div>Document</div>
          <LinkIcon/>
        </div>
      </a>
      <a href="/markdown/view/chat-presets.md" target="_blank" rel="noopener noreferrer">
        <div className="flex-center">
          <div>Presets</div>
          <LinkIcon/>
        </div>
      </a>
      <CreditDiv refreshKey={messages} />
    </div>
  );
}

export default ChatInformation;