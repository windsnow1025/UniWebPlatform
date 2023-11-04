import { ThemeProvider } from '@mui/material/styles';
import React, {useState, useEffect} from 'react';
import { getInitMUITheme } from "../manager/ThemeManager";
import AutocompleteComponent from './AutocompleteComponent';

function ConversationAutocomplete(props) {
    const [theme, setTheme] = useState(getInitMUITheme());
    useEffect(() => {
        const handleThemeChange = (event) => {
            setTheme(event.detail);
        };
        window.addEventListener('themeChanged', handleThemeChange);
    }, []);

    const conversation = props.conversation;
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(conversation.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }, []);

    const handleOptionClick = async (index) => {
        await conversation.setConversation(index);
    }

    const handleDelete = async (index) => {
        await conversation.cloudDelete(index);
        await conversation.fetch_conversations();
        setOptions(conversation.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    };

    const handleAdd = async (value) => {
        await conversation.cloudUpload(value);
        await conversation.fetch_conversations();
        setOptions(conversation.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }

    const handleUpdate = async (index, value) => {
        await conversation.cloudUpdate(index, value);
        await conversation.fetch_conversations();
        setOptions(conversation.conversations.map(conversation => ({ label: conversation.name, value: conversation.id })));
    }

    return (
        <ThemeProvider theme={theme}>
            <AutocompleteComponent
                options={options}
                label={"Select a conversation"}
                handleOptionClick={handleOptionClick}
                handleDelete={handleDelete}
                handleAdd={handleAdd}
                handleUpdate={handleUpdate}
            />
        </ThemeProvider>
    );
}

export default ConversationAutocomplete;