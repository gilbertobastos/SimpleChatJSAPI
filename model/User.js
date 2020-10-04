const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('./db/users');

class User{
    constructor(login, name, id = (new Date()).toJSON()) {
        this._id = id;
        this.login = login;
        this.name = name;
    }

    /**
     * Save a user on the database.
     *  
     * @param {User} user The user object.
     */
    static save(user) {
        return new Promise((resolve, reject) => {
            db.put(user)
                .then(result => resolve(result))
                .catch(err => reject(err));   
        });
    }

    /**
     * Return a object of the user.
     * 
     * @param {String} loginParam The login of the user.
     */
    static fetchByLogin(loginParam) {
        return new Promise((resolve, reject) => {
            db.find({selector: {login: loginParam}})
                .then(result => {
                    const user = result.docs[0];
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    }
                      
    /**
     * Fetch all users saved on the database.
     */
    static fetchAll() {
        return new Promise((resolve, reject) => {
            db.allDocs({include_docs: true})
                .then(result => {
                    resolve(result.rows.map(row => row.doc));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = User;