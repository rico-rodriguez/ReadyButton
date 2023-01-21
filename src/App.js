import { Routes, Route, BrowserRouter, useNavigate  } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ButtonClicker from './ButtonClicker';
import Home from './Home';
import {createTheme, ThemeProvider} from "@mui/material";

// Request cookies to see if user is logged in
const theme = createTheme({
    palette: {
        primary: {
            foreground: '#000000',
            main: '#fff',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
        root: {
            background: 'red'
        }
    },
    components: {
        // Name of the component
        MuiCircularProgress: {
            defaultProps: {
                thickness: 1.6,
            },
            styleOverrides: {
                circle: {
                    color: '#58c549',
                },
            },
        },
    },
});
function App() {
    const navigate = useNavigate();
    useEffect(() => {
        // check for cookie
        const cookie = document.cookie;
        if (!cookie) {
            navigate('/');
        }
    }, [navigate]);
    return (
<ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/:urlId" element={<ButtonClicker />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
    );
}

export default App;
