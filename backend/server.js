// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });
const cookieParser = require('cookie-parser');

const express = require('express');
const cors = require('cors');
// get MongoDB driver connection
const dbo = require('./db/conn');
const PORT = process.env.PORT || 5000;
const app = express();

require('./models/ButtonSchema');
require('./models/UserSchema');



app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
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
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });


});

