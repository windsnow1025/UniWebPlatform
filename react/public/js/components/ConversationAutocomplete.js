import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import { getInitMUITheme } from "../theme";
import AutocompleteComponent from './AutocompleteComponent';

function ConversationAutocomplete(props) {
    const [theme, setTheme] = useState(getInitMUITheme());
    useEffect(() => {
        const handleThemeChange = (event) => {
            setTheme(event.detail);
        };
        window.addEventListener('themeChanged', handleThemeChange);
    }, []);

    const gpt = props.gpt;
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(gpt.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }, []);

    const handleOptionClick = async (index) => {
        await gpt.setConversation(index);
    }

    const handleDelete = async (index) => {
        await gpt.cloudDelete(index);
        await gpt.fetch_conversations();
        setOptions(gpt.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    };

    const handleAdd = async (value) => {
        await gpt.cloudUpload(value);
        await gpt.fetch_conversations();
        setOptions(gpt.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }

    return (
        <ThemeProvider theme={theme}>
            <AutocompleteComponent
                options={options}
                label={"Select a conversation"}
                handleOptionClick={handleOptionClick}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
            />
        </ThemeProvider>
    );
}

export default ConversationAutocomplete;