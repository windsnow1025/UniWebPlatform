import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertTheme } from "./theme";
import axios from "axios";

function Select() {
    const [options, setOptions] = useState([]);

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

    useEffect(() => {
        fetch_conversations();
    });

    async function fetch_conversations() {
        try {
            const res = await axios.get('/api/conversation/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOptions(res.data.map(conversation => ({ label: conversation.name, value: conversation.id })));
        } catch (err) {
            console.error(err);
        }
    }

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
