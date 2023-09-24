import React, { useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/react-style.css';

const filter = createFilterOptions();

function Select({ options, label, handleOptionClick, handleDelete, handleAdd }) {
    const [value, setValue] = useState(null);

    const handleDeleteClick = (event, index) => {
        event.stopPropagation();
        handleDelete(index);
    };

    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
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
                if (typeof option === 'string') {
                    return option;
                }
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
                    {!option.isNew && <DeleteIcon className="deleteIcon" onClick={(event) => handleDeleteClick(event, state.index)} />}
                </li>
            )}
            freeSolo
            renderInput={(params) => (
                <TextField {...params} label={label} variant="outlined" style={{ width: '300px' }} />
            )}
        />
    );
}

export default Select;