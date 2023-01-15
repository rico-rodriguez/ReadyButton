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
});
function App() {
    return (
<ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route path="/mssa" element={<Home/>} />
                <Route path="/:urlId" element={<ButtonClicker />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
    );
}

export default App;
