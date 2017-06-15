const jwt = require('jsonwebtoken');

const {ObjectId} = require('mongodb');

const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOne = new ObjectId();
const userTwo = new ObjectId();

const users = [{
    _id: userOne,
    email: 'vincemagtubo@gmail.com',
    password: 'password1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOne, access: 'auth'}, '_').toString()
    }]
}, {
    _id: userTwo,
    email: 'vincegarcia@gmail.com',
    password: 'password2'
}];

const todos = [{
    _id: new ObjectId(),
    text: 'First test'
}, {
    _id: new ObjectId(),
    text: 'Second test',
    completedAt: 12345,
    completed: true
}, {
    _id: new ObjectId(),
    text: 'Third test'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    users,
    populateUsers,
    todos,
    populateTodos
};