//start program
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });    
});

app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email
    });

    user.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/users', (req, res) => {
    User.find().then((users) => {
        res.send({users});
    }, (err) => {
        res.status(400).send(err);
    });
});


app.get('/todos/:todoID', (req, res) => {
    var todoID = req.params.todoID;

    if (!ObjectId.isValid(todoID)) {
        console.log('Fak somthin nigguh happend');
        return res.status(404).send();
    }

    Todo.findById(todoID).then((_todoID) => {
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


app.delete('/todos/:todoIDrmv', (req, res) => {
    var todoIDrmv = req.params.todoIDrmv;

    if (!ObjectId.isValid(todoIDrmv)) {
        console.log('Faking shit happend');
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(todoIDrmv).then((_todoIDrmv) => {
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

// app.listen(3000, () => {
//     console.log('Started on port 3000');
// });

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = {
    app
};