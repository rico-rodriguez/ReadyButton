var app = require('express')();
var http = require('http').createServer(app);
const httpServer = http.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:5000');
});
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
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
});
// const app = new Realm.App({ id: 'readybtn-fvinc' });
// const credentials = Realm.Credentials.anonymous();
// try {
//   const user = await app.logIn(credentials);
//   console.log("Successfully logged in!", user.id);
//   return user;
// } catch (err) {
//   console.error("Failed to log in", err.message);
// }


// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
const cookieParser = require('cookie-parser');
const express = require('express');
// const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./db/conn');
const PORT = process.env.PORT || 5000;
// const app = express();

require('./models/ButtonSchema');
require('./models/UserSchema');

app.use(cookieParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('origin') );
  next();
});
app.use(cors({
  origin: function(origin, callback){
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
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