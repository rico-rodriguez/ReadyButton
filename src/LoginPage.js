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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            // successfully logged in, do something with the returned data
            // such as setting a cookie or redirecting to a different page
            setCookie('user', data.username, 1);
            navigate('/')
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{backgroundColor:"white", borderRadius:"5px", padding:"40px", margin:"auto"}}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit">
                    Log In
                </Button>
            </form>
        </div>
    );
}
