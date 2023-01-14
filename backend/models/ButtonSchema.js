const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buttonSchema = new Schema({
    urlId: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
});

const ButtonSchema = mongoose.model('ButtonSchema', buttonSchema, 'buttons');
module.exports = ButtonSchema;
