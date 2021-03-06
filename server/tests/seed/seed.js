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
        token: jwt.sign({_id: userOne, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwo,
    email: 'vincegarcia@gmail.com',
    password: 'password2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwo, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectId(),
    text: 'First test',
    _createdBy: userOne
}, {
    _id: new ObjectId(),
    text: 'Second test',
    completedAt: 12345,
    completed: true,
    _createdBy: userTwo
}, {
    _id: new ObjectId(),
    text: 'Third test',
    _createdBy: userTwo
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