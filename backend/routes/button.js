const express = require('express');
const buttonRoutes = express.Router();
const dbo = require('../db/conn');
const mongoose = require("mongoose");
const UserData = mongoose.model('UserSchema');
const Button = mongoose.model('ButtonSchema', 'buttons');
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const connectionString = process.env.ATLAS_URI;

// buttonRoutes.route('/').post(async function () {
//     console.log('POST /');
//     const newButton = new Button({
//         urlId: "153654789",
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
    await client.connect(err => {
        let userId = req.cookies.userId;
        if (!userId) {
            userId = uuid.v4();
            res.cookie('userId', userId, {
                maxAge: 9000000, // expires in 15 minutes
                httpOnly: true
            });
        }
        res.send({ userId });
    });
});

buttonRoutes.route('/api/user/id').get(async (req, res) => {
    let userId = req.cookies.userId;
    if (!userId) {
        console.log('No user ID found, creating a new one');
        userId = uuid.v4();
        res.cookie('userId', userId, {
            maxAge: 9000000, // expires in 15 minutes
            httpOnly: true
        });
    }
    console.log('User ID:', userId);
    console.log('User ID found, sending it to the client');
    res.send({ userId });
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
            button = {
                urlId: req.params.urlId,
                count: 0
            };
            await collection.insertOne(button);
        }
        res.json({ count: button.count });
        await client.close();
    });
});

buttonRoutes.route('/api/button/increment/:urlId')
    .patch(async (req, res) => {
        try {

        } catch (err) {
            console.error('Error updating click count:', err);
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
                        collection.updateOne({ urlId: req.params.urlId }, { $inc: { count: 1 } }, function (err, result) {
                            if (err) throw err;
                            res.status(200).json({ message: "Button count updated" });
                            client.close();
                        });

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
            // code to reset button count
            io.emit('reset', { urlId: req.params.urlId });
            // code to send response
        } catch (err) {
            console.error('Error resetting click count:', err);
        }
        try {
            const button = await Button.findOne({ urlId: req.params.urlId });
            if (!button) {
                res.status(404).json({ message: "Button not found" });
            } else {
// reset button count
                button.count = 0;
                await button.save();
                res.json({ message: 'Button count reset successfully' });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
module.exports = buttonRoutes;