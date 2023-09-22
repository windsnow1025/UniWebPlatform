import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';

function Select() {
    const [options, setOptions] = useState([
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ]);

    const convertTheme = (systemTheme) => {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (systemTheme !== "system") {
            return systemTheme;
        }
        if (prefersDarkScheme.matches) {
            return "dark";
        } else if (!prefersDarkScheme.matches) {
            return "light";
        }
    }

    const [muiTheme, setMuiTheme] = useState(createTheme({
        palette: {
            mode: convertTheme(localStorage.getItem('theme')),
        }
    }));

    useEffect(() => {
        const handleThemeChange = () => {
            const newTheme = createTheme({
                palette: {
                    mode: convertTheme(localStorage.getItem('theme')),
                },
            });
            setMuiTheme(newTheme);
        };

        // Listen for custom event
        window.addEventListener('themeChanged', handleThemeChange);

        return () => {
            window.removeEventListener('themeChanged', handleThemeChange);
        };
    }, []);

    const handleDelete = (optionToDelete) => {
        setOptions(options.filter((option) => option !== optionToDelete));
    };

    return (
        <ThemeProvider theme={muiTheme}>
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
        </ThemeProvider>
    );
}

export default Select;
