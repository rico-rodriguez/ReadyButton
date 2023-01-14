import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ButtonClicker from './ButtonClicker';
import Home from './Home';

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/:urlId" element={<ButtonClicker />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
