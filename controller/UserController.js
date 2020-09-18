const User = require('../model/User');

exports.getUsersInfo = (req, res, next) => {
    /* Seeing if the request was to some specific user using the login */
    const userLogin = req.params.userLogin;

    if (userLogin) {
        User.fetchByLogin(userLogin)
            .then(result => {
                res.json(result);
                res.STATUS_CODE = 200;
                res.end();
            })
            .catch(err => {
                res.json(err);
                res.STATUS_CODE = 400;
                res.end();
            });
    } else {
        User.fetchAll(userLogin)
            .then(result => {
                res.json(result);
                res.STATUS_CODE = 200;
                res.end();
            })
            .catch(err => {
                res.json(err);
                res.STATUS_CODE = 400;
                res.end();
            });
    }
}

exports.saveUser = (req, res, next) => {
    /* Seeing if some of the values where not supplied. */
    if (!req.body.login || !req.body.name) {
        res.STATUS_CODE = 400;
        res.json('Some of the values needed where not supplied.');
        res.end();
        return;
    }

    User.save(new User(req.body.login, req.body.name))
        .then(result => {
            res.STATUS_CODE = 201;
            res.end();
        })
        .catch(err => {
            res.STATUS_CODE = 400;
            res.json(err);
            res.end();
        });
}