import React, {useState, useEffect, useContext} from 'react';
import { ThemeContext } from './ThemeContext';
import ConversationsSelect from './ConversationsSelect';

function ConversationsSelectApp() {
    const initialTheme = useContext(ThemeContext);
    const [theme, setTheme] = useState(initialTheme);

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

    return (
        <ThemeContext.Provider value={theme}>
            <ConversationsSelect />
        </ThemeContext.Provider>
    );
}

export default ConversationsSelectApp;