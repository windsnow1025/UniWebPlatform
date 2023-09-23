import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';

function Select({ options, handleDelete }) {
    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
                <TextField {...params} label="Select an option" variant="outlined" style={{ width: '300px' }} />
            )}
            renderOption={(props, option) => (
                <li {...props}>
                    {option.label}
                    <DeleteIcon
                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                        onClick={() => handleDelete(option)}
                    />
                </li>
            )}
        />
    );
}

export default Select;