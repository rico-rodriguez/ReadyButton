import {Button, FormControl, FormHelperText, Input, InputLabel, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";


export default function Login() {
const [name, setName] = React.useState('');
const [isLoggedIn, setIsLoggedIn] = React.useState(false);
const [userName, setUserName] = React.useState('');
const handleChange = (event) => {
    setName(event.target.value)

}
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }
    useEffect(() => {
        const cookie = document.cookie;
        if (cookie) {
            const cookieValue = cookie.split('=')[1];
            setIsLoggedIn(true);
            setUserName(cookieValue);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(name)
        try {
            await fetch('https://readybutton.herokuapp.com/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: name}),
                withCredentials: true,
                credentials: 'include'
            }).then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            }).then(data => {
                if(data.isLoggedIn){
                    setIsLoggedIn(true)
                    setUserName(data.username)
                    setCookie('username', data.username, 1);

                } else {
                    setIsLoggedIn(false)
                }
            }).catch(error => console.log(error));
        }
        catch (err) {
            console.error('Error logging in:', err)
        }
    }


    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor:"white", borderRadius:"5px", padding:"10px" }}>
            {isLoggedIn ? <p>Welcome, {userName}</p> :
                <FormControl>
                <InputLabel style={{color:"black"}} htmlFor="my-input">User Name</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text"  value={name} onChange={handleChange}/>
                <FormHelperText style={{color: "red"}} id="my-helper-text">A username is required to participate.</FormHelperText>
                <Button size="small" variant="outlined" onClick={handleSubmit} style={{color:"#010202", display:"block", width:"100%"}}>Submit</Button>
            </FormControl>}
        </div>
    );
}
