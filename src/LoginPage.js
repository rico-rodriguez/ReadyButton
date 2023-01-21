import React, { useState } from 'react';
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
        backgroundColor: 'rgba(255,255,255,0.65)',
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
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://readybutton.herokuapp.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            // successfully logged in, do something with the returned data
            // such as setting a cookie or redirecting to a different page
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
                <TextField
                    className={classes.formControl}
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress className={classes.progress} /> : 'Log In'}
                </Button>
            </form>
        </div>
    );
}