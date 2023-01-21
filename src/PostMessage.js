import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

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
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        // Send a POST request to the server to create the message
        fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, user: currentUser })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setMessage('');
            })
            .catch(err => console.error(err));
    }

    return (
        <div style={{position:"fixed", top: "200px"}}>
            {currentUser ? (
                <form onSubmit={handleSubmit}>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} />
                    <button type="submit">Post</button>
                </form>
            ) : (
                <Button color="primary" contained disabled>Send Message</Button>
            )}
        </div>
    );
}

export default PostMessage;