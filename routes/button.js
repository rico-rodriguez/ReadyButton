const express = require('express');
const buttonRoutes = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;
let userId;
let username;
let user;
const Realm = require('realm');
const app = express();

app.use('/', buttonRoutes);

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

    res.json({isLoggedIn: true, username: username});
});

buttonRoutes.route('/logout').post(async function (req, res) {
    // Remove the username from local storage
    localStorage.removeItem('username');

    res.json({isLoggedIn: false});
} );


buttonRoutes.route('/api/check-session').get(async (req, res) => {
    if (localStorage.getItem('username')) {
        res.json({ loggedIn: true, username: localStorage.getItem('username') });
    } else {
        res.json({ loggedIn: false });
    }
} );

//initial page load
buttonRoutes.route('/api/user/id').get(async (req, res) => {
    // set username to the authorized header value
    const username = req.headers.authorization;
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
    console.log('userId connected to button:/urlId route : ' + req.headers.authorization);

    if (!req.headers.authorization) {
        res.status(401).json({isLoggedIn: false});
        return;
    } else {
        let auth = req.headers.authorization;
        if( auth !== undefined && auth.startsWith("Bearer ")){
            auth = auth.slice(7);
            username = auth;
        }
    }

    await client.connect(async err => {
        const collection = client.db("button").collection("users");
        const result = await collection.findOne({urlId: req.params.urlId});
        if(result) {
            if(result.usersArray.indexOf(username) !== -1) {
                res.json({count: result.count, alreadyClicked: true});
            } else {
                res.json({count: result.count, alreadyClicked: false});
            }
        } else {
            res.json({count: 0, alreadyClicked: false});
        }
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
            const username = localStorage.getItem('username');
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
        console.error('Error resetting click count: ', err);
      }

      try {
        const client = new MongoClient(connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
          const username = localStorage.getItem('username');

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