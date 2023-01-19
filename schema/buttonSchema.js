class ButtonSchema extends Realm.Object {
    static schema = {
        name: "Button",
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            count: "int",
            urlId: "string",
            usersArray: "string[]?",
        },
        primaryKey: '_id',
    };
}