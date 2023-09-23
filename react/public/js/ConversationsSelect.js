import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import axios from "axios";
import { getInitMUITheme } from "./theme";
import Select from './Select';

function ConversationsSelect() {
    const [theme, setTheme] = useState(getInitMUITheme());
    useEffect(() => {
        const handleThemeChange = (event) => {
            setTheme(event.detail);
        };
        window.addEventListener('themeChanged', handleThemeChange);
    }, []);

    const [options, setOptions] = useState([]);

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
        <ThemeProvider theme={theme}>
            <Select options={options} handleDelete={handleDelete} />
        </ThemeProvider>
    );
}

export default ConversationsSelect;