const express = require('express');
const buttonRoutes = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;
const cookieParser = require('cookie-parser');


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
const realm = Realm.open({
  schema: [ButtonSchema],
});
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

const createTask = async (realm) => {
  let task;
  try {
    realm.write(() => {
      task = realm.create("Button", {
        urlId: "rico4321",
        count: 0,
        usersArray: [realm.syncSession.user.id],
      });
    });
  } catch (error) {
    console.error(`Failed to create task: ${error}`);
  }
  return task;
}

buttonRoutes.route('/test').post(async function (req,res) {
  let task;
  try {
    const realm = await Realm.open({
      schema: [ButtonSchema],
    });
    task = await createTask(realm);
  } catch (error) {
    console.error(`Failed to open realm: ${error}`);
  }
  res.json(task);
});



//initial page load
buttonRoutes.route('/api/user/id').get(async (req, res) => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect(async err => {
    let userId = req.cookies.userId;
    console.log('userId: ' + userId);
    if (!userId || userId === 'undefined' || userId === 'null') {
      userId = uuid.v4();
      res.cookie('userId', userId, {
        maxAge: 9000000, // expires in 15 minutes
        httpOnly: true
      });
    }
    res.send({ userId });
    await client.close();
  });
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
      let userId = req.cookies.userId;
      if (!userId || userId === 'undefined' || userId === 'null') {
        userId = uuid.v4();
        res.cookie('userId', userId, {
          maxAge: 9000000, // expires in 15 minutes
          httpOnly: true
        });
      }
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
              let userId = req.cookies.userId;
              if (userId === 'undefined' || userId === 'null') {
                userId = uuid.v4();
                res.cookie('userId', userId, {
                  maxAge: 9000000, // expires in 15 minutes
                  httpOnly: true
                });
              }
              if (!button.usersArray.includes(userId)) {
                console.log(userId)
                collection.updateOne({ urlId: req.params.urlId }, {
                  $inc: { count: 1 },
                  $push: { usersArray: req.cookies.userId }
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
              let userId = req.cookies.userId;
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