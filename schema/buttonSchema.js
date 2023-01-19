class Button extends Realm.Object {
    static get name() {
        return 'Button';
    }

    static get properties() {
        return {
            count: 'int',
            urlId: 'string',
            usersArray: {type: 'list', objectType: 'string'},
        };
    }
}