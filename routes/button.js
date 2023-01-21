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
// buttonRoutes.route('/').get(async function (req, res) {
//     if (req.cookies.username) {
//         userId = req.cookies.username;
//         console.log("previous user connected with id: " + userId);
//         res.json({isLoggedIn: true, username: userId});
//     }
//     else {
//         res.json({isLoggedIn: false});
//     }
// });
buttonRoutes.route('/login').post(async function (req, res) {
    const app = new Realm.App({ id: 'readybtn-fvinc' });
// Extract the username from the request body
    const { username } = req.body;
    const loginPayload = {username: req.body.username};
    const credentials = Realm.Credentials.function(loginPayload);
    const user = await app.logIn(credentials);
    console.log(`Logged in with the user id: ${user.id}`);

    let cookie = req.cookies.username
    if (cookie === undefined) {
        res.cookie('username', username, { maxAge: 900000, httpOnly: true, sameSite: 'none', secure: true });
        console.log('cookie created successfully');
        console.log(cookie)
        console.log(username);
        res.json({isLoggedIn: true, username: username});
    }
    else {
        console.log('cookie exists', cookie);
        res.json({isLoggedIn: true, username: username});
        console.log(username);
    }
});

buttonRoutes.route('/logout').post(async function (req, res) {
    res.clearCookie('username');
    res.clearCookie('connect.sid');
    res.json({isLoggedIn: false});
} );
buttonRoutes.route('/api/check-session').get(async (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
} );

//initial page load
buttonRoutes.route('/api/user/id').get(async (req, res) => {
    console.log(req.cookies)
    const username = req.cookies.username;
    console.log('userId connected to user route : ' + username);
    res.json({isLoggedIn: true, username: username});
});
buttonRoutes.route('/api/users').get(async (req, res) => {
    try {
        const client = new MongoClient(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        const collection = client.db("button").collection("users");
        const result = await collection.find({"usersArray": {$exists: true}}).toArray();
        console.log(result)
        res.json(result);
        await client.close();
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


buttonRoutes.route("/api/button/:urlId").get(async (req, res) => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const username = req.cookies.username;
    console.log("Username from cookie:", req.cookies); // check if the cookie is being set correctly

  await client.connect(async err => {
    const collection = client.db("button").collection("buttons");
    let button = await collection.findOne({ urlId: req.params.urlId });
    if (!button) {
      console.log('Button not found, creating a new one');
      button = {
        urlId: req.params.urlId,
        count: 0,
        usersArray: [username]
      };
      console.log('Button:', button);
      await collection.insertOne(button);
    }
    res.json({ count: button.count, isLoggedIn: true, username: username });
    console.log('Button count:', button.count);
    console.log('Button count sent to the client')
    await client.close();
  });
});

buttonRoutes.route('/api/button/increment/:urlId')
    .patch(async (req, res) => {
        try {
            const client = new MongoClient(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const username = req.cookies.username;
            await client.connect(err => {
                const collection = client.db("button").collection("buttons");
                collection.findOne({ urlId: req.params.urlId }, function (err, button) {
                    if (err) throw err;
                    if (!button) {
                        res.status(404).json({ message: "Button not found" });
                    } else {
                        if (!button.usersArray.includes(username)) {
                            console.log(username + " is not in the array");
                            collection.updateOne({ urlId: req.params.urlId }, {
                                $inc: { count: 1 },
                                $addToSet: { usersArray: username }
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
          const username = req.cookies.username;

          await client.connect(err => {
          const collection = client.db("button").collection("buttons");
          collection.findOne({ urlId: req.params.urlId }, function (err, button) {
            if (err) throw err;
            if (!button) {
              res.status(404).json({ message: "Button not found" });
            } else {
              if (button.usersArray[0] === username) {
                collection.updateOne({ urlId: req.params.urlId },
                    { $set: { count: 0, usersArray: [username]  } },
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