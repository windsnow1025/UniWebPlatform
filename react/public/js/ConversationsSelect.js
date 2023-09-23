import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import { ThemeContext } from "./ThemeContext";
import Select from './Select';

function ConversationsSelect() {
    const [options, setOptions] = useState([]);

    const initTheme = useContext(ThemeContext);
    const [theme, setTheme] = useState(initTheme);

    useEffect(() => {
        const handleThemeChange = (event) => {
            const theme = event.detail;
            setTheme(theme);
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
        <ThemeProvider theme={theme}>
            <Select options={options} handleDelete={handleDelete} />
        </ThemeProvider>
    );
}

export default ConversationsSelect;