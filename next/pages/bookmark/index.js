import React, {useEffect} from 'react';
import BookmarkDataGrid from "../../app/components/bookmark/BookmarkDataGrid";

function Index() {
  useEffect(() => {
    document.title = "Bookmark";
  }, []);

  return (
    <div className="local-scroll-container">
      
      <div className="local-scroll-scrollable">
        <BookmarkDataGrid/>
      </div>
    </div>
  );
}

export default Index;