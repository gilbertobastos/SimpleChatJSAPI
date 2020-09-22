const Message = require('../model/Message');
const User = require('../model/User');

exports.getMessagesForUser = (req, res, next) => {
    /* Seeing if the user exists */
    const userLogin = req.params.userLogin; 
    const onlyUnreadMessages = req.body.onlyUnreadMessages;

    User.fetchByLogin(userLogin)
        .then(result => {
            if (!result) {
                res.json('Login not found.');
                res.STATUS_CODE = 400;
                res.end();
                return;
            } 
        })
        .catch(err => {
            res.json(err);
            res.STATUS_CODE = 400;
            res.end();           
            return;
        });

    Message.fetchAllMessagesForUser(userLogin, onlyUnreadMessages)
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

exports.saveMessage = (req, res, next) => {
    /* Seeing if some of the values where not supplied. */
    if (!req.body.userRecipientLogin ||
        !req.body.userDestinationLogin ||
        !req.body.text) {
            res.STATUS_CODE = 400;
            res.json('Some of the values needed where not supplied.');
            res.end();
            return; 
    }

    Message.save(new Message(req.body.userRecipientLogin, req.body.userDestinationLogin, req.body.text))
        .then(result => {
            res.json(result);
            res.STATUS_CODE = 201;
            res.end();
        })
        .catch(err => {
            res.json(err);
            res.STATUS_CODE = 400;
            res.end();
        });
}