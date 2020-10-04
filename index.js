const UserController = require('./controller/UserController');
const MessageController = require('./controller/MessageController');
const Express = require('express');
const bodyParser = require('body-parser');
const User = require('./model/User');

const app = new Express();

app.use(Express.json());

/* Users */
app.get('/user/:userLogin', UserController.getUsersInfo);
app.get('/user/', UserController.getUsersInfo);
app.post('/user/', UserController.saveUser);

/* Messages */
app.get('/user/:userLogin/message/', MessageController.getMessagesForUser);
app.post('/message/', MessageController.saveMessage);

app.listen(3000);   
