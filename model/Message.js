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
    
    /**
     * Save a message on the database.
     * 
     * @param {Message} message The message object. 
     */
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

    /**
     * Return a array with the messages send by the user.
     * 
     * @param {String} userLogin The user login.
     */
    static fetchAllMessagesSendBy(userLogin) {
        return new Promise((resolve, reject) => {
            db.find({include_docs: true, selector: {userRecipientLogin: userLogin}})
                .then(result => {
                    resolve(result.docs);
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Return a array with the messages send for the user.
     * 
     * @param {String} userLogin The user login.
     * @param {boolean} onlyUnreadMessages Get only unread messages?
     */
    static fetchAllMessagesForUser(userLogin, onlyUnreadMessages = true) {
        return new Promise((resolve, reject) => {
            db.find({include_docs: true, selector: {userDestinationLogin: userLogin, messageRead: !onlyUnreadMessages}})
                .then(result => {
                    resolve(result.docs);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = Message;