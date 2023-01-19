class Car extends Realm.Object {
    static schema = {
        name: "Car",
        properties: {
            _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
            count: "int",
            urlId: "string",
            usersArray: "string[]?",
        },
        primaryKey: '_id',
    };
}