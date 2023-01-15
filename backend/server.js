var app = require('express')();
var http = require('http').createServer(app);
const httpServer = http.listen(process.env.PORT, () => {
  console.log("listening on *:${process.env.PORT}");
});
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'https://readybutton.herokuapp.com',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('increment', (data) => {
    io.emit('snackbar', { message: 'Hello World!' });
    io.emit('increment', data);
  });
});

// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
const cookieParser = require('cookie-parser');
const express = require('express');
// const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./db/conn');

require('./models/ButtonSchema');
require('./models/UserSchema');

app.use(cookieParser());

app.use(cors({ origin: 'https://readybutton.herokuapp.com', credentials: true }));
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
