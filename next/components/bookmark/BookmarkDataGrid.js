import React from 'react';
import BookmarkLogic from '../../lib/bookmark/BookmarkLogic';
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
    return await bookmarkLogic.fetchBookmarks();
  };

  const addRow = async (row) => {
    return await bookmarkLogic.addBookmark(row);
  };

  const updateRow = async (row) => {
    return await bookmarkLogic.updateBookmark(
      row.id,
      {
        firstTitle: row.firstTitle,
        secondTitle: row.secondTitle,
        url: row.url,
        comment: row.comment,
      },
    );
  };

  const deleteRow = async (id) => {
    return await bookmarkLogic.deleteBookmark(id);
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