import '../src/asset/css/index.css';

import React, {useState, useEffect} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import AuthDiv from '../app/components/common/AuthDiv';
import ThemeSelect from '../app/components/common/ThemeSelect';
import {BookmarkLogic} from '../src/logic/BookmarkLogic';
import {getInitMUITheme, getLightMUITheme} from '../src/logic/ThemeLogic';
import {
  GridRowModes,
  DataGridPremium,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem, DEFAULT_GRID_COL_TYPE_KEY, getGridDefaultColumnTypes
} from '@mui/x-data-grid-premium';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {AppBar} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

function EditToolbar(props) {
  const {setRows, setRowModesModel, rows} = props;

  const handleClick = () => {
    const id = Math.max(...rows.map((row) => row.id)) + 1;
    setRows((oldRows) => [{id, firstTitle: '', secondTitle: '', url: '', comment: '', isNew: true}, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {mode: GridRowModes.Edit, fieldToFocus: 'firstTitle'},
    }));
  };

  return (
    <GridToolbarContainer>
      <GridToolbar/>
      <Button color="primary" startIcon={<AddIcon/>} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function Bookmark() {
  const [theme, setTheme] = useState(getLightMUITheme());
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const bookmarkLogic = new BookmarkLogic();

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    setTheme(getInitMUITheme());
  }, []);

  useEffect(() => {
    loadBookmarks();
    document.title = "Bookmark";
  }, []);

  const loadBookmarks = async () => {
    const bookmarks = await bookmarkLogic.fetchBookmarks();
    if (bookmarks) {
      setRows(bookmarks);
    }
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const processRowUpdate = async (newRow) => {
    const updatedRow = {...newRow, isNew: false};
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    if (newRow.isNew) {
      try {
        await bookmarkLogic.addBookmark(updatedRow);
      } catch (e) {
        setAlertOpen(true);
        setAlertMessage(e.message);
        return;
      }
    } else {
      try {
        await bookmarkLogic.updateBookmark(updatedRow.id, updatedRow);
      } catch (e) {
        setAlertOpen(true);
        setAlertMessage(e.message);
        return;
      }
    }
    loadBookmarks();
    return updatedRow;
  };

  const handleDeleteClick = async (id) => {
    try {
      await bookmarkLogic.deleteBookmark(id);
    } catch (e) {
      setAlertOpen(true);
      setAlertMessage(e.message);
      return;
    }
    loadBookmarks();
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: {mode: GridRowModes.View, ignoreModifications: true},
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const wrapOperator = (operator) => {
    const getApplyFilterFn = (filterItem, column) => {
      const innerFilterFn = operator.getApplyFilterFn(filterItem, column);
      if (!innerFilterFn) {
        return innerFilterFn;
      }

      return (params) => {
        if (rowSelectionModelLookupRef.current[params.id] || rowModesModel[params.id]?.mode === GridRowModes.Edit) {
          return true;
        }

        return innerFilterFn(params);
      };
    };

    return {
      ...operator,
      getApplyFilterFn,
    };
  };

  const defaultColumnTypes = getGridDefaultColumnTypes();

  const wrapFilterOperators = (columns) => {
    return columns.map((col) => {
      const filterOperators =
        col.filterOperators ??
        defaultColumnTypes[col.type ?? DEFAULT_GRID_COL_TYPE_KEY].filterOperators;

      return {
        ...col,
        filterOperators: filterOperators.map((operator) => wrapOperator(operator)),
      };
    });
  };

  const columns = wrapFilterOperators([
    {field: 'firstTitle', headerName: 'First Title', flex: 0.15, editable: true},
    {field: 'secondTitle', headerName: 'Second Title', flex: 0.15, editable: true},
    {field: 'url', headerName: 'URL', flex: 0.35, editable: true},
    {field: 'comment', headerName: 'Comment', flex: 0.3, editable: true},
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      getActions: ({id}) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon/>}
              label="Save"
              onClick={() => setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}})}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon/>}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon/>}
            label="Edit"
            onClick={() => setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}})}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon/>}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
          />,
        ];
      },
    },
  ]);

  const [models, setModels] = useState({
    rowSelectionModel: [],
    filterModel: {},
  });

  const rowSelectionModelLookup = React.useMemo(
    () =>
      models.rowSelectionModel.reduce((lookup, rowId) => {
        lookup[rowId] = rowId;
        return lookup;
      }, {}),
    [models.rowSelectionModel],
  );

  const rowSelectionModelLookupRef = React.useRef(rowSelectionModelLookup);
  rowSelectionModelLookupRef.current = rowSelectionModelLookup;

  const handleRowSelectionModelChange = React.useCallback(
    (newRowSelectionModel) =>
      setModels((prev) => ({
        ...prev,
        rowSelectionModel: newRowSelectionModel,
        // Forces the re-application of the filtering process
        filterModel: { ...prev.filterModel },
      })),
    [],
  );

  const handleFilterModelChange = React.useCallback(
    (newFilterModel) =>
      setModels((prev) => ({ ...prev, filterModel: newFilterModel })),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="secondary">
        <div className="flex-around p-2">
          <h1 className="grow">Bookmarks</h1>
          <div className="m-1"><AuthDiv/></div>
          <div className="m-1"><ThemeSelect/></div>
        </div>
      </AppBar>
      <div>
        <DataGridPremium
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          onFilterModelChange={handleFilterModelChange}
          handleRowModelChange={(newModel) => setRowModesModel(newModel)}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {setRows, setRowModesModel, rows},
          }}
        />
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </ThemeProvider>
  );
}

export default Bookmark;