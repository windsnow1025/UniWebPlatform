import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { convertTheme } from "./theme";
import Select from './Select';

function ConversationsSelect() {
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
    }, []);

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
            <Select options={options} handleDelete={handleDelete} />
        </ThemeProvider>
    );
}

export default ConversationsSelect;