const uuid = require('uuid');
const {uuidV4} = require("mongodb/lib/core/utils");
class Button extends Realm.Object {
    _id = new uuidV4();
    count = 0;
    urlId = '';
    usersArray = [];
}
Button.primaryKey = '_id';
