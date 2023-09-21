import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';

import { convertTheme, applyMUITheme } from './theme';

const systemTheme = localStorage.getItem("theme");
const theme = convertTheme(systemTheme);
const MUITheme = applyMUITheme(theme);

function Select() {
    const [options, setOptions] = useState([
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ]);

    const handleDelete = (optionToDelete) => {
        setOptions(options.filter((option) => option !== optionToDelete));
    };

    return (
        <div>
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
        </div>
    );
}

function SelectApp() {
    return (
        <ThemeProvider theme={MUITheme}>
            <CssBaseline />
            <main>
                <Select />
            </main>
        </ThemeProvider>
    );
}

export default SelectApp;