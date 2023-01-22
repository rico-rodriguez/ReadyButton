import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com', {
    withCredentials: true,
});

function PostMessage() {
    const [message, setMessage] = useState('');
    const [currentButtonOwner, setCurrentButtonOwner] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [canPostMessage, setCanPostMessage] = useState(true);

    useEffect(async () => {
    setCurrentUser(localStorage.getItem('username'));
        // Fetch the list of users from the server
        const response = await fetch(
          `https://readybutton.herokuapp.com/api/users`,
          {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': 'true',
                  Authorization: `Bearer ${currentUser}`
              },
              credentials: 'include',
              withCredentials: true,
          }
        );
        const data = await response.json();
        setCurrentButtonOwner(data.usersArray[0]);
        if (!currentButtonOwner === currentUser) {
            setCanPostMessage(false);
        }
        // Listen for new messages from the server
        socket.on('new message', data => {
            console.log(data);
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        // Send the message to the server via Socket.io
        sendMessage({ message, user: currentUser });
        setMessage('');
    }

    function sendMessage(messageData) {
        socket.emit('new message', messageData);
    }

    return (
        <div style={{ position: 'fixed', top: '20px', left: '20px', backgroundColor:"white", borderRadius:"5px", padding:"10px" }}>
            {canPostMessage ? (
                <form onSubmit={handleSubmit}>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} />
                    <button type="submit">Post</button>
                </form>
            ) : (
                <Button color="primary" contained disabled>Post Message</Button>
            )}
        </div>
    );
}

export default PostMessage;

