// var app = require('express')();
const express = require('express');
const app = express();

var http = require('http').createServer(app);
const httpServer = http.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:5000');
});
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://readybutton.netlify.app',
    methods: ['GET', 'POST'],
    allowCredentials: true,
    credentials: true,
    transports: ['websocket', 'polling'],
    headers: {
        'Access-Control-Allow-Origin': 'https://readybutton.netlify.app',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'Access-Control-Request-Method': 'GET, POST',
    }

  },
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('increment', (data) => {
    io.emit('setLoading', true);
    setTimeout(() => {
      io.emit('setLoading', false);
    }, 1500);
    io.emit('snackbar', { message: 'Hello World!' });
    io.emit('increment', data);
  });
  socket.on('reset', (data) => {
    io.emit('setLoading', true);
    setTimeout(() => {
      io.emit('setLoading', false);
    }, 1500);
    io.emit('snackbar', { message: 'Hello World!' });
    io.emit('reset', data);
  });
    // Listening for the new message event
    socket.on('new message', (message) => {
        // Broadcasting the message to all connected clients
        io.emit('new message', message);
    });
});

function checkAuth(req, res, next) {
// Check if user has a valid session
    if (localStorage.getItem('username')) {
        // User is logged in, proceed to the next middleware or route handler
        next();
    } else {
        // User is not logged in, redirect to login page
        res.redirect('/');
    }
}
app.get('/:id', checkAuth, (req, res) => {
    res.sendFile(__dirname + '/index.html');
} );
const Realm = require('realm');
const realm = new Realm.App({ id: 'readybtn-fvinc' });

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
// const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./db/conn');
const PORT = process.env.PORT || 5000;
// const app = express();

require('./models/ButtonSchema');
require('./models/UserSchema');
const buttonRoutes = require("./routes/button");


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://readybutton.netlify.app"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true,
  allowCredentials: true
}));
app.use(express.json());
app.use(require('./routes/button'));
// Global error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
});

// perform a database connection when the server starts
dbo.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
  // start the Express server
  // app.listen(PORT, () => {
  //   console.log(`Server is running on port: ${PORT}`);
  // });
});