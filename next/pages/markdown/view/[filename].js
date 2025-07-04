import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import PublicClient from "../../../lib/common/public/PublicClient";
import TextContent from '../../../components/message/content/text/TextContent';
import {RawEditableState} from '../../../lib/common/message/EditableState';
import {useTheme} from "@mui/material";

function MarkdownViewer() {
  const router = useRouter();
  const {filename} = router.query;
  const [markdown, setMarkdown] = useState('');

  const fetchMarkdown = async () => {
    const publicService = new PublicClient();
    const markdownContent = await publicService.fetchMarkdown(filename);
    setMarkdown(markdownContent);
  };

  useEffect(() => {
    if (filename) {
      fetchMarkdown();
      document.title = filename;
    }
  }, [filename]);

  return (
    <div className="local-scroll-container">
      <div className="local-scroll-scrollable">
        <div className="m-2">
          <TextContent
            content={markdown}
            setContent={() => {}}
            rawEditableState={RawEditableState.AlwaysFalse}
          />
        </div>
      </div>
    </div>
  );
}

export default MarkdownViewer;
