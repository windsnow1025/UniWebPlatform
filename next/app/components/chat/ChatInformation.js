import React, {useEffect, useState} from 'react';
import LinkIcon from "@mui/icons-material/Link";
import UserService from "../../../src/service/UserService";

function ChatInformation({ messages }) {
  const userService = new UserService();

  const [credit, setCredit] = useState(0);

  useEffect(() => {
    const fetchCredit = async () => {
      if (localStorage.getItem('token')) {
        const credit = await userService.fetchCredit();
        setCredit(credit);
      }
    };

    fetchCredit();
  }, [messages]);

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
      <div>Credit: {credit}</div>
    </div>
  );
}

export default ChatInformation;