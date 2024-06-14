import React from 'react';
import LinkIcon from "@mui/icons-material/Link";
import CreditDiv from "../common/user/CreditDiv";

function ChatInformation() {
  return (
    <div className="flex-around m-2">
      <a href="/markdown/view/chat-doc.md" target="_blank" rel="noopener noreferrer">
        <div className="flex-center">
          <div>Document</div>
          <LinkIcon/>
        </div>
      </a>
    </div>
  );
}

export default ChatInformation;