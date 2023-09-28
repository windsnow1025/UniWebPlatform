import React from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import '../../css/react-style.css';

const filter = createFilterOptions();

function AutocompleteComponent({ options, label, handleOptionClick, handleDelete, handleAdd, handleUpdate }) { // Add handleUpdate prop

    const handleDeleteClick = (event, index) => {
        event.stopPropagation();
        handleDelete(index);
    };

    const handleUpdateClick = (event, index, value) => { // Add handleUpdateClick function
        event.stopPropagation();
        handleUpdate(index, value);
    };

    return (
        <Autocomplete
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.label);
                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        label: `Add "${inputValue}"`,
                        isNew: true,
                    });
                }

                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={options}
            getOptionLabel={(option) => {
                if (option.inputValue) {
                    return option.inputValue;
                }
                return option.label;
            }}
            renderOption={(props, option, state) => (
                <li {...props} onClick={() => {
                    if (option.isNew) {
                        handleAdd(option.inputValue);
                    } else {
                        handleOptionClick(state.index);
                    }
                }}>
                    {option.label}
                    {!option.isNew &&
                        <div className="iconContainer">
                            <UpdateIcon className="icon" onClick={(event) => handleUpdateClick(event, state.index, option.label)} />
                            <DeleteIcon className="icon" onClick={(event) => handleDeleteClick(event, state.index)} />
                        </div>
                    }
                </li>
            )}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label={label} variant="outlined" style={{ width: '300px' }} />
            )}
        />
    );
}

export default AutocompleteComponent;