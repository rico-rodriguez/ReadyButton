const express = require('express');
const buttonRoutes = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;
let userId;
let user;
const Realm = require('realm');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = require("express/lib/router");

app.use(cookieParser());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
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
buttonRoutes.route('/login').post(async function (req, res) {
    // Extract the username from the request body
    const { username } = req.body;

    // Log in the user and get the user object
    const app = new Realm.App({ id: 'readybtn-fvinc' });
    const loginPayload = {username: req.body.username};
    const credentials = Realm.Credentials.function(loginPayload);
    const user = await app.logIn(credentials);

    // Store the username in the session
    req.session.username = username;
        console.log('session exists', req.session.username);
        res.json({isLoggedIn: true, username: username});
        console.log(username);
});


buttonRoutes.route('/logout').post(async function (req, res) {
    req.session.destroy();
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
    const username = req.session.username;
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
    let username;
    if (req.session && req.session.username) {
        username = req.session.username;
    } else {
        res.redirect("/");
    }

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
            const username = req.session.username;
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
          const username = req.session.username;

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