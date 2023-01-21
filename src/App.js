import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ButtonClicker from './ButtonClicker';
import Home from './Home';

const useStyles = makeStyles({
    splash: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function App() {
    const [cookies] = useCookies(['user']);
    const navigate = useNavigate();
    const classes = useStyles();
    const [showSplash, setShowSplash] = React.useState(true);

    useEffect(() => {
        if (cookies.user) {
            setShowSplash(false);
        } else {
            navigate('/');
        }
    }, [cookies.user, navigate]);

    return (
        <>
            {showSplash && (
                <div className={classes.splash}>
                    <Home />
                </div>
            )}
            {!showSplash && <ButtonClicker />}
        </>
    );
}

export default App;
