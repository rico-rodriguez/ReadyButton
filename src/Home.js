import socketClient from 'socket.io-client';
const io = require('socket.io-client');
const socket = io('http://localhost:5000/', {
  withCredentials: false,
});
socket.on('connect', () => {
  console.log(`I'm connected with the back-end`);
  socket.emit('connection', null);
});

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
