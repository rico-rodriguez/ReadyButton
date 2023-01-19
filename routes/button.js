const express = require('express');
const buttonRoutes = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;
const cookieParser = require('cookie-parser');

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

//initial page load
buttonRoutes.route('/api/user/id').get(async (req, res) => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let userId = req.session.user;
  if (
    !userId ||
    userId === '' ||
    userId === null ||
    userId === 'null' ||
    userId === undefined
  ) {
    req.session.regenerate(function (err) {
      if (err) next(err);
      // store user information in session, typically a user id
      req.session.user = uuid.v4();
      userId = req.session.user;
      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        console.log('error saving new user');
      });
    });
  }
  await client.connect(async (err) => {
    res.send({ userId });
    await client.close();
  });
});
buttonRoutes.route('/api/button/:urlId').get(async (req, res) => {
  const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect(async (err) => {
    const collection = client.db('button').collection('buttons');
    let button = await collection.findOne({ urlId: req.params.urlId });
    let userId = req.session.userId;
    if (!button) {
      console.log('Button not found, creating a new one');
      if (!userId || userId === '' || userId === null) {
        alert('UserID is null bozo');
      }
      button = {
        urlId: req.params.urlId,
        count: 0,
        usersArray: [userId],
      };
      console.log('Button:', button);
      await collection.insertOne(button);
    }
    res.json({ count: button.count });
    console.log('Button count:', button.count);
    console.log('Button count sent to the client');
    await client.close();
  });
});

buttonRoutes.route('/api/button/increment/:urlId').patch(async (req, res) => {
  try {
  } catch (err) {
    console.error('Error setting loading spinner:', err);
  }

  try {
    const client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect((err) => {
      const collection = client.db('button').collection('buttons');
      collection.findOne({ urlId: req.params.urlId }, function (err, button) {
        if (err) throw err;
        if (!button) {
          res.status(404).json({ message: 'Button not found' });
        } else {
          let userId = req.session.userId;
          if (
            !userId ||
            userId === '' ||
            userId === null ||
            userId === 'null' ||
            userId === undefined
          ) {
            userId = uuid.v4();
            req.session.userId = userId;
          }
          if (!button.usersArray.includes(userId)) {
            console.log(userId);
            collection.updateOne(
              { urlId: req.params.urlId },
              {
                $inc: { count: 1 },
                $push: { usersArray: userId },
              },
              function (err, result) {
                if (err) throw err;
                res.status(200).json({ message: 'Button count updated' });
                client.close();
              }
            );
          } else {
            res.status(401).json({ message: 'Already clicked!' });
          }
        }
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
buttonRoutes.route('/api/button/reset/:urlId').patch(async (req, res) => {
  try {
  } catch (err) {
    console.error('Error resetting click count:', err);
  }

  try {
    const client = new MongoClient(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect((err) => {
      const collection = client.db('button').collection('buttons');
      collection.findOne({ urlId: req.params.urlId }, function (err, button) {
        if (err) throw err;
        if (!button) {
          res.status(404).json({ message: 'Button not found' });
        } else {
          let userId = req.session.userId;
          if (
            !userId ||
            userId === '' ||
            userId === null ||
            userId === 'null' ||
            userId === undefined
          ) {
            userId = uuid.v4();
            req.session.userId = userId;
          }
          if (button.usersArray[0] === userId) {
            collection.updateOne(
              { urlId: req.params.urlId },
              { $set: { count: 0, usersArray: [userId] } },
              function (err, result) {
                if (err) throw err;
                res.status(200).json({ message: 'Button count updated' });
                client.close();
              }
            );
          } else {
            res.status(401).json({ message: 'Unauthorized' });
          }
        }
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = buttonRoutes;
