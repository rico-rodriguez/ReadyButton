class Button extends Realm.Object { }
Button.schema = {
    name: 'Button',
    properties: {
        count: 'int',
        urlId: 'string',
        usersArray: {type: 'list', objectType: 'string'},
    }
};
