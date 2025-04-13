import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  DataGridPremium,
  DEFAULT_GRID_COL_TYPE_KEY,
  getGridDefaultColumnTypes,
  GridActionsCellItem,
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid-premium';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function EditToolbar({onAddRow}) {
  return (
    <GridToolbarContainer>
      <GridToolbar/>
      <Button startIcon={<AddIcon/>} onClick={onAddRow}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function CustomDataGrid({
                          columns,
                          fetchData,
                          addRow,
                          updateRow,
                          deleteRow,
                        }) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setRows(data);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity('error');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = {...newRow, isNew: false};
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    try {
      if (newRow.isNew) {
        await addRow(updatedRow);
        setAlertMessage('Record added');
      } else {
        await updateRow(updatedRow);
        setAlertMessage('Record updated');
      }
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
    } finally {
      setAlertOpen(true);
      await loadData();
    }
    return updatedRow;
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteRow(id);
      setAlertMessage('Record deleted');
      setAlertSeverity('success');
      await loadData();
    } catch (error) {
      setAlertMessage(error.message);
      setAlertSeverity('error');
    } finally {
      setAlertOpen(true);
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: {mode: GridRowModes.View, ignoreModifications: true},
    }));

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const handleAddRow = () => {
    const id = Math.max(0, ...rows.map((row) => row.id)) + 1;

    const newRowDefaults = columns.reduce((acc, col) => {
      let defaultValue = '';
      if (col.type === 'number') {
        defaultValue = 0;
      } else if (col.type === 'boolean') {
        defaultValue = false;
      }
      acc[col.field] = defaultValue;
      return acc;
    }, {});

    setRows((prevRows) => [
      {
        ...newRowDefaults,
        id: id,
        isNew: true,
      },
      ...prevRows,
    ]);

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: {mode: GridRowModes.Edit, fieldToFocus: columns[0]?.field},
    }));
  };

  const wrapOperator = (operator) => {
    const getApplyFilterFn = (filterItem, column) => {
      const innerFilterFn = operator.getApplyFilterFn(filterItem, column);
      if (!innerFilterFn) {
        return innerFilterFn;
      }

      return (value, row, column, apiRef) => {
        const rowId = apiRef.current.getRowId(row);
        if (rowSelectionModelLookupRef.current[rowId] || rowModesModel[rowId]?.mode === GridRowModes.Edit) {
          return true;
        }

        return innerFilterFn(value, row, column, apiRef);
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

  const enhancedColumns = wrapFilterOperators([
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      getActions: ({id}) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon/>}
              label="Save"
              onClick={() =>
                setRowModesModel((prevModel) => ({
                  ...prevModel,
                  [id]: {mode: GridRowModes.View},
                }))
              }
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
            onClick={() =>
              setRowModesModel((prevModel) => ({
                ...prevModel,
                [id]: {mode: GridRowModes.Edit},
              }))
            }
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

  const rowSelectionModelLookup = useMemo(
    () =>
      models.rowSelectionModel.reduce((lookup, rowId) => {
        lookup[rowId] = rowId;
        return lookup;
      }, {}),
    [models.rowSelectionModel]
  );

  const rowSelectionModelLookupRef = useRef(rowSelectionModelLookup);
  rowSelectionModelLookupRef.current = rowSelectionModelLookup;

  const handleRowSelectionModelChange = useCallback(
    (newRowSelectionModel) =>
      setModels((prev) => ({
        ...prev,
        rowSelectionModel: newRowSelectionModel,
        filterModel: {...prev.filterModel},
      })),
    []
  );

  const handleFilterModelChange = useCallback(
    (newFilterModel) =>
      setModels((prev) => ({...prev, filterModel: newFilterModel})),
    []
  );

  return (
    <div>
      <div>
        <DataGridPremium
          rows={rows}
          columns={enhancedColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          onFilterModelChange={handleFilterModelChange}
          handleRowModelChange={(newModel) => setRowModesModel(newModel)}
          processRowUpdate={processRowUpdate}
          loading={loading}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: {onAddRow: handleAddRow},
          }}
          pagination={true}
        />
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{width: '100%'}}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CustomDataGrid;