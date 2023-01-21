import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
const io = require('socket.io-client');
const socket = io('https://readybutton.herokuapp.com', {
    withCredentials: true,
});
function PostMessage() {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch the list of users from the server
        fetch('/api/users')
            .then(res => res.json())
            .then(users => {
                setUsers(users);
                setCurrentUser(users[0]);
            })
            .catch(err => console.error(err));

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
            {currentUser ? (
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
