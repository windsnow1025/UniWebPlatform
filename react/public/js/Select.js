import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import '../css/react-style.css';

function Select({ options, label, handleOptionClick, handleDelete }) {
    const handleDeleteClick = (event, index) => {
        event.stopPropagation();
        handleDelete(index);
    };

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
                <TextField {...params} label={label} variant="outlined" style={{ width: '300px' }} />
            )}
            renderOption={(props, option, state) => (
                <li {...props} onClick={() => handleOptionClick(state.index)}>
                    {option.label}
                    <DeleteIcon className="deleteIcon" onClick={(event) => handleDeleteClick(event, state.index)} />
                </li>
            )}
        />
    );
}

export default Select;