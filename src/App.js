import {Routes, Route, BrowserRouter, useNavigate} from 'react-router-dom';

import ButtonClicker from './ButtonClicker';
import Home from './Home';
import LoginPage from './LoginPage';
import {createTheme, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import Login from "./Login";

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
function clientCheckAuth(next) {
    fetch('https://readybutton.herokuapp.com/api/check-session', {
        method: 'GET',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // This is required for CORS support to work
            'Access-Control-Allow-Credentials': 'true', // This is required for cookies, authorization headers with HTTPS
        },
    }).then(res => {
        if(res.status === 401){
            window.location.href = '/';
            alert("Session expired, please login again.");
        }
        else{
            next();
        }
    }).catch(err => {
        console.error(err);
    });
}

function App() {
    const [loggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const cookie = document.cookie;
        setIsLoggedIn(!!cookie);
    }, []);
    return (
<ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                {/*<Route path="/login" element={<LoginPage />} />*/}
                {loggedIn && <Route path="/:urlId"  element={<ButtonClicker/>}/> }
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
    );
}

export default App;
