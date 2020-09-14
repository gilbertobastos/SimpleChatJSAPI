const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('./db/messages');

const User = require('./User');

class Message{
    constructor(userRecipientLogin, userDestinationLogin, text) {
        this._id = (new Date()).toJSON();
        this.userRecipientLogin = userRecipientLogin;
        this.userDestinationLogin = userDestinationLogin;
    }
    
    static save(message) {
        const p = new Promise((resolve, reject) => {
            /* See if exists in the database users with the logins stored in
            the message object */
            User.fetchByLogin(message.userRecipientLogin)
                .then(result => {
                    if (!result) {
                        reject(new Error('The login supplied of recipient user doesn\'t exists on the database.'));
                    }
                    return User.fetchByLogin(message.userDestinationLogin);
                })
                .then(result => {
                    if (!result) {
                        reject(new Error('The login of supplied of destination user doesn\'t exists on the database.'));
                    }
                })
                .then(() => {
                    /* Saving the message on the database */
                    db.put(message)
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));                   
        });

        return p;
    }
}

module.exports = Message;