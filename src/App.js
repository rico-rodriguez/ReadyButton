import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ButtonClicker from './ButtonClicker';
import Home from './Home';
import {createTheme, ThemeProvider} from "@mui/material";


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
                root: {
                    color: '#68da52',
                },
                circle: {
                    color: '#64748B',
                },
                svg: {
                    color: '#cecece',
                },
                colorSecondary: {
                    color: '#b7a856',
                },
                colorPrimary: {
                    color: '#ce3397',
                }
            }
        },
    },
});
function App() {
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
