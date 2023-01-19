class Button extends Realm.Object {
    @Realm.PrimaryKey()
    _id = new ObjectId();
    count = 0;
    urlId = '';
    usersArray = [];
}
