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
  await client.connect(async (err) => {
    let userId = await req.cookies.userId;
    console.log('1userId: ' + userId);
    if (!userId || userId === 'undefined' || userId === 'null') {
      userId = uuid.v4();
      res.cookie('userId', userId, {
        maxAge: 9000000, // expires in 15 minutes
        httpOnly: true,
      });
    }
    console.log('2userId: ' + userId);

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
    if (!button) {
      console.log('Button not found, creating a new one');
      let userId = req.cookies.userId;
      if (!userId || userId === 'undefined' || userId === 'null') {
        userId = uuid.v4();
        res.cookie('userId', userId, {
          maxAge: 9000000, // expires in 15 minutes
          httpOnly: true,
        });
      }
      button = {
        urlId: req.params.urlId,
        count: 0,
        usersArray: [userId],
      };
      console.log('Button:', button);
      await collection.insertOne(button);
    }
    // get usersArray from button and send the value to the client
    let usersArray = button.usersArray;
    console.log('usersArray ' + usersArray);
    // res.send(button.usersArray)
    res.json({ count: button.count, usersArray: usersArray });
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
          let userId = req.cookies.userId;
          if (userId === 'undefined' || userId === 'null') {
            userId = uuid.v4();
            res.cookie('userId', userId, {
              maxAge: 9000000, // expires in 15 minutes
              httpOnly: true,
            });
          }
          if (button.usersArray.includes(userId)) {
            console.log(userId + 'Has not clicked before, incrementing');
            collection.updateOne(
              { urlId: req.params.urlId },
              {
                $inc: { count: 1 },
                $push: { usersArray: req.cookies.userId },
              },
              function (err, result) {
                if (err) throw err;
                res.status(200).json({ message: 'Button count updated' });
                console.log('Button count updated, usersArray : ' + usersArray);
                res.json({ usersArray: button.usersArray });
                client.close();
              }
            );
          } else {
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
          let userId = req.cookies.userId;
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
