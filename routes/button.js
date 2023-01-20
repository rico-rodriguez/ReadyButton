const express = require('express');
const buttonRoutes = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;
const cookieParser = require('cookie-parser');
let userId;
let user;
const Realm = require('realm');

// const buttonSchema = require('./schema/buttonSchema');
class ButtonSchema extends Realm.Object {
  static schema = {
    name: "Button",
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      count: "int",
      urlId: "string",
      usersArray: {type: 'list', objectType: 'string'}
    },
    primaryKey: '_id',
  };
}
// buttonRoutes.route('/').post(async function () {
//     console.log('POST /');
//     const newButton = new Button({
//         urlId: "rico",
//         count: 0
//     });
//     const client = new MongoClient(connectionString, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     await client.connect(err => {
//         const collection = client.db("button").collection("buttons");
//         collection.insertOne(newButton, function (err, res) {
//             if (err) throw err;
//             console.log("1 document inserted");
//             client.close();
//         });
//     });
// });
buttonRoutes.route('/').get(async function (req, res) {
    if (req.cookies.user) {
        userId = req.cookies.user;
        console.log("previous user connected with id: " + userId);
        res.json({isLoggedIn: true, username: userId});
    }
    else {
        res.json({isLoggedIn: false});
    }
});
buttonRoutes.route('/login').post(async function (req, res) {
    const app = new Realm.App({ id: 'readybtn-fvinc' });
// Extract the username from the request body
    const { username } = req.body;
    const loginPayload = {username: req.body.username};
    const credentials = Realm.Credentials.function(loginPayload);
    const user = await app.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);

    let cookie = req.cookies.user
    if (cookie === undefined) {
        res.cookie('user', username, { maxAge: 900000, httpOnly: false });
        console.log('cookie created successfully');
        console.log(username);
        res.json({isLoggedIn: true, username: username});
    }
    else {
        console.log('cookie exists', cookie);
        res.json({isLoggedIn: true, username: username});
        console.log(username);
    }
});


//initial page load
buttonRoutes.route('/api/user/id').get(async (req, res) => {
    const username = req.cookies.user;
    console.log('userId connected to user route : ' + username);
    res.send({ username });
});

buttonRoutes.route("/api/button/:urlId").get(async (req, res) => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect(async err => {
    const collection = client.db("button").collection("buttons");
    let button = await collection.findOne({ urlId: req.params.urlId });
    if (!button) {
      console.log('Button not found, creating a new one');
      button = {
        urlId: req.params.urlId,
        count: 0,
        usersArray: [userId,]
      };
      console.log('Button:', button);
      await collection.insertOne(button);
    }
    res.json({ count: button.count });
    console.log('Button count:', button.count);
    console.log('Button count sent to the client')
    await client.close();
  });
});

buttonRoutes.route('/api/button/increment/:urlId')
    .patch(async (req, res) => {
      try {
      } catch (err) {
        console.error('Error setting loading spinner:', err);
      }

      try {
        const client = new MongoClient(connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect(err => {
          const collection = client.db("button").collection("buttons");
          collection.findOne({ urlId: req.params.urlId }, function (err, button) {
            if (err) throw err;
            if (!button) {
              res.status(404).json({ message: "Button not found" });
            } else {
// Initialize your App.
//               const app = new Realm.App({
//                 id: "readybtn-fvinc",
//               });
              // let userId = app.currentUser.id;
              if (!button.usersArray.includes(userId)) {
                console.log(userId)
                collection.updateOne({ urlId: req.params.urlId }, {
                  $inc: { count: 1 },
                  $push: { usersArray: userId }
                }, function(err, result) {
                  if (err) throw err;
                  res.status(200).json({ message: "Button count updated" });
                  client.close();
                });
              } else {
                res.status(401).json({ message: "Already clicked!" });
              }
            }
          });
        });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
buttonRoutes.route('/api/button/reset/:urlId')
    .patch(async (req, res) => {
      try {

      } catch (err) {
        console.error('Error resetting click count:', err);
      }

      try {
        const client = new MongoClient(connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect(err => {
          const collection = client.db("button").collection("buttons");
          collection.findOne({ urlId: req.params.urlId }, function (err, button) {
            if (err) throw err;
            if (!button) {
              res.status(404).json({ message: "Button not found" });
            } else {
              // Initialize your App.
              // const app = new Realm.App({
              //   id: "readybtn-fvinc",
              // });
              // let userId = app.currentUser.id;
              if (button.usersArray[0] === userId) {
                collection.updateOne({ urlId: req.params.urlId },
                    { $set: { count: 0, usersArray: [userId, ]  } },
                    function (err, result) {
                      if (err) throw err;
                      res.status(200).json({ message: "Button count updated" });
                      client.close();
                    });
              } else {
                res.status(401).json({ message: "Unauthorized" });
              }
            }
          });
        });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }

    });
module.exports = buttonRoutes;