const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('./db/users');

class User{
    constructor(login, name) {
        this._id = (new Date()).toJSON();
        this.login = login;
        this.name = name;
    }

    static save(user) {
        const p = new Promise((resolve, reject) => {
            db.put(user)
                .then(result => resolve(result))
                .catch(err => reject(err));   
        });

        return p;
    }

    static fetchByLogin(loginParam) {
        const p = new Promise((resolve, reject) => {
            db.find({selector: {login: loginParam}})
                .then(result => {resolve(result.docs[0])})
                .catch(err => reject(err));
        });

        return p;
    }
                        
    static fetchAll() {
        const p = new Promise((resolve, reject) => {
            db.allDocs()
                .then(result => resolve(result.rows))
                .catch(err => reject(err));
        });

        return p;
    }
}

module.exports = User;