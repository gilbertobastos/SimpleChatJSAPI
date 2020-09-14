const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const User = require('./User');

class Message{
    constructor(userRecipientLogin, userDestinationLogin, text) {
        this._id = (new Date()).toJSON();
        this.userRecipientLogin = userRecipientLogin;
        this.userDestinationLogin = userDestinationLogin;
    }
    
    static save(message) {
        const p = new Promise((resolve, reject) => {
            let userRecip;
            let userDest;
            
            /* See if exists in the database users with the logins stored in
            the message object */
            User.fetchByLogin(message.userRecipientLogin)
                .then(result => {
                    userRecip = result;
                    return User.fetchByLogin(message.userDestinationLogin);
                })
                .then(result => {
                    userDest = result
                })
                .catch(err => reject(err));
            
            if (!userRecip || !userDest) {
                reject(new Error('The login supplied doesn\'t exists on the database.'));
            }

            /* Saving the message on the database */
            db.put(message)
                .then(result => resolve(result))
                .catch(err => reject(err));       
        });

        return p;
    }
}

module.exports = Message;