import uuid from "uuid";

class Button extends Realm.Object {
    _id = uuid();
    count = 0;
    urlId = '';
    usersArray = [];
    static schema = {
        name: 'Button',
        primaryKey: '_id',
        properties: {
            _id: 'string',
            count: 'int',
            urlId: 'string',
            usersArray: 'string[]'
        }
    }
}
