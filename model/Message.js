const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('./db/messages');

const User = require('./User');

class Message{
    constructor(userRecipientLogin, userDestinationLogin, text, id = (new Date()).toJSON()) {
        this._id = id;
        this.userRecipientLogin = userRecipientLogin;
        this.userDestinationLogin = userDestinationLogin;
        this.text = text;
        this.messageRead = false;
    }
    
    static save(message) {
        return new Promise((resolve, reject) => {
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
                        reject(new Error('The login supplied of destination user doesn\'t exists on the database.'));
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
    }

    static fetchAllMessagesSendBy(user) {
        return new Promise((resolve, reject) => {
            db.find({selector: {userRecipientLogin: user.login}})
                .then(result => {
                    resolve(
                        result.docs.map((messageOfArray) => {
                            return Message(
                                messageOfArray.userRecipientLogin, 
                                messageOfArray.userDestinationLogin,
                                messageOfArray.text, 
                                messageOfArray._id
                            );
                    }));
                })
                .catch(err => reject(err));
        });
    }

    static fetchAllMessagesForUser(user, onlyUnreadMessages = true) {
        return new Promise((resolve, reject) => {
            db.find({selector: {userDestinationLogin: user.login, messageRead: !onlyUnreadMessages}})
                .then(result => {
                    resolve(
                        result.docs.map((messageOfArray) => {
                            return Message(
                                messageOfArray.userRecipientLogin, 
                                messageOfArray.userDestinationLogin,
                                messageOfArray.text, 
                                messageOfArray._id
                            );
                    }));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = Message;