import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import { getInitMUITheme } from "./theme";
import Select from './Select';

function ConversationsSelect(props) {
    const [theme, setTheme] = useState(getInitMUITheme());
    useEffect(() => {
        const handleThemeChange = (event) => {
            setTheme(event.detail);
        };
        window.addEventListener('themeChanged', handleThemeChange);
    }, []);

    const [options, setOptions] = useState([]);

    useEffect(() => {
        console.log(props.gpt)
        setOptions(props.gpt.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }, []);

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