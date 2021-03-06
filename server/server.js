//start program
require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

/* 
    *****POSTS******
*/

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _createdBy: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });    
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _createdBy: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:todoID', authenticate, (req, res) => {
    var todoID = req.params.todoID;

    if (!ObjectId.isValid(todoID)) {
        console.log('Fak somthin nigguh happend');
        return res.status(404).send();
    }

    Todo.findOne({
        _id: todoID,
        _createdBy: req.user._id
    }).then((_todoID) => {
        if (!_todoID) {
            res.status(404).send();
        } else {
            res.send({_todoID});
            console.log('Todo ID: ', _todoID);
            console.log();
        }
    }).catch(() => {
        res.status(400).send();
    });
});


app.delete('/todos/:todoIDrmv', authenticate, (req, res) => {
    var todoIDrmv = req.params.todoIDrmv;

    if (!ObjectId.isValid(todoIDrmv)) {
        console.log('Faking shit happend');
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: todoIDrmv,
        _createdBy: req.user._id
    }).then((_todoIDrmv) => {
        if (!_todoIDrmv) {
            res.status(404).send();
            console.log('Haha wala e sorry');
        } else {
            res.status(200).send({_todoIDrmv});
            console.log(`Todo ID removed: ${_todoIDrmv}`);
            console.log();
        }
    }).catch((err) => {
        res.status(400).send();
    });
});


app.patch('/todos/:todoIDupd', authenticate, (req, res) => {
    var todoIDupd = req.params.todoIDupd;

    //subsets of the things user wants to pass
    var body = _.pick(req.body, ['text', 'completed']);
    
    if (!ObjectId.isValid(todoIDupd)) {
        console.log('damn shit niggut hapend');
        return res.status(404).send();
    }

    //update through completed property
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Todo.findByIdAndUpdate(todoIDupd, {
    //     $set: body
    // }

    Todo.findOneAndUpdate({
        _id: todoIDupd,
        _createdBy: req.user._id
    }, {
        $set: body
    }, {
        new: true
    }).then((_todoIDupd) => {
        if (!_todoIDupd) {
            console.log('Fak empthy');
            return res.status(404).send();
        } else {
            console.log(`Todo updated: ${_todoIDupd}`);
            console.log();
            res.status(200).send({_todoIDupd});
        }
    }).catch((err) => {
        res.status(400).send();
    });
});

/* 
    *****////POSTS******

/* 
    *****USERS******
*/


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({users});
    }, (err) => {
        res.status(400).send(err);
    });
});

//private
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


//for reusable
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((userLogin) => {
        return userLogin.generateAuthToken().then((tokenLogin) => {
            res.header('x-auth', tokenLogin).send(userLogin);
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//for logging out/deleting token
app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
       res.status(200).send();
   }, () => {
       res.status(400).send(); 
   });
});


/* 
    *****////USERS******

//salt = _
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = {
    app
};