const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('./db/users');

class User{
    constructor(login, name, id = (new Date()).toJSON()) {
        this._id = id;
        this.login = login;
        this.name = name;
    }

    static save(user) {
        return new Promise((resolve, reject) => {
            db.put(user)
                .then(result => resolve(result))
                .catch(err => reject(err));   
        });
    }

    static fetchByLogin(loginParam) {
        return new Promise((resolve, reject) => {
            db.find({selector: {login: loginParam}})
                .then(result => {
                    if (result.docs.length === 0) {
                        resolve(undefined);
                    }

                    let user = new User(result.docs[0].login, result.docs[0].name, result.docs[0]._id);                
                    resolve(user);
                })
                .catch(err => reject(err));
        });
    }
                        
    static fetchAll() {
        return new Promise((resolve, reject) => {
            db.allDocs({include_docs: true})
                .then(result => {
                    resolve(result.rows.map((userOfArray) => {
                        return new User(
                            userOfArray.doc.login, 
                            userOfArray.doc.name,
                            userOfArray.doc._id);
                    }));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = User;