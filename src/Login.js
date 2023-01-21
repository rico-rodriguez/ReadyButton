import {Button, FormControl, FormHelperText, Input, InputLabel} from "@mui/material";
import React, {useEffect, useState} from "react";

export default function Login() {
    const [name, setName] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const handleChange = (event) => {
        setName(event.target.value)
    }
    useEffect(() => {
        const session = sessionStorage.getItem('username');
        if (session) {
            setIsLoggedIn(true);
            setUserName(session);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(name)
        try {
            const response = await fetch('https://readybutton.herokuapp.com/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: name}),
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(data.isLoggedIn);
                setUserName(data.username);
                sessionStorage.setItem('username', data.username);
            } else {
                console.log('Error logging in');
            }
        } catch (err) {
            console.error('Error logging in:', err);
        }
    }

    async function Logout() {
        try {
            await fetch('https://readybutton.herokuapp.com/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true',
                    },
                    credentials: 'include',
                }
            );
// Clear session storage
            sessionStorage.clear();
// Update local state
            setIsLoggedIn(false);
            setUserName('');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px"
        }}>
            {isLoggedIn ? <div><p>Welcome, {userName}</p> <Button size="small" variant="outlined" onClick={Logout}
                                                                  style={{
                                                                      color: "#010202",
                                                                      display: "block",
                                                                      width: "100%"
                                                                  }}>Log Out</Button></div> :
                <FormControl>
                    <InputLabel style={{color: "black"}} htmlFor="my-input">User Name</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" value={name} onChange={handleChange}/>
                    <FormHelperText id="my-helper-text" style={{color: "black"}}>Enter Your User Name</FormHelperText>
                    <Button onClick={handleSubmit} style={{color: "#010202", display: "block", width: "100%"}}>Log
                        In</Button>
                </FormControl>}
        </div>
    );
}