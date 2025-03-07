import React from 'react';
import BookmarkLogic from '../../../src/bookmark/BookmarkLogic';
import CustomDataGrid from "../common/CustomDataGrid";

function BookmarkDataGrid() {
  const bookmarkLogic = new BookmarkLogic();

  const columns = [
    {field: 'firstTitle', headerName: 'First Title', flex: 0.15, editable: true},
    {field: 'secondTitle', headerName: 'Second Title', flex: 0.15, editable: true},
    {
      field: 'url',
      headerName: 'URL',
      flex: 0.35,
      editable: true,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {field: 'comment', headerName: 'Comment', flex: 0.3, editable: true},
  ];

  const fetchData = async () => {
    try {
      const bookmarks = await bookmarkLogic.fetchBookmarks();
      return bookmarks || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  };

  const addRow = async (row) => {
    try {
      await bookmarkLogic.addBookmark(row);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  };

  const updateRow = async (row) => {
    try {
      await bookmarkLogic.updateBookmark(
        row.id,
        {
          firstTitle: row.firstTitle,
          secondTitle: row.secondTitle,
          url: row.url,
          comment: row.comment,
        },
      );
    } catch (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }
  };

  const deleteRow = async (id) => {
    try {
      await bookmarkLogic.deleteBookmark(id);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  };

  return (
    <CustomDataGrid
      columns={columns}
      fetchData={fetchData}
      addRow={addRow}
      updateRow={updateRow}
      deleteRow={deleteRow}
    />
  );
}

export default BookmarkDataGrid;