import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    Typography,
    CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2),
    },
    formControl: {
        width: '100%',
        margin: theme.spacing(2),
    },
    submitButton: {
        margin: theme.spacing(2),
    },
    progress: {
        margin: theme.spacing(2),
    },
}));

export default function Login() {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
useEffect(() => {
    // check for cookie
    const cookie = document.cookie;
    if (cookie) {
        navigate('/');
    }
}, [navigate]);

const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
        const response = await fetch('https://readybutton.herokuapp.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        // set the cookie
        document.cookie = `username=${data.username}`;
        // redirect to the previous page
        navigate(data.redirectUrl);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};

return (
    <div className={classes.root}>
        <Typography variant="h5">Log In</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
            <TextField
                className={classes.formControl}
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Button
                className={classes.submitButton}
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? (
                    <CircularProgress className={classes.progress} />
                ) : (
                    'Log In'
                )}
            </Button>
        </form>
    </div>
);
}
