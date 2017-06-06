const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

const {ObjectId} = require('mongodb');

var todoId = '5935f7c465a272192ca5183b';


if (!ObjectId.isValid(todoId)) {
    console.log('Fak it no shit found');
} 

Todo.find({
    _id: todoId
}).then((todo) => {
    console.log('Todo by All ', todo);
    console.log('\n');
});


Todo.findOne({
    _id: todoId
}).then((todo) => {
    console.log('Todo by One ', todo);
    console.log('\n');
});


Todo.findById(todoId).then((todo) => {
    if (!todo) {
        return console.log('Fak no Id nigguh');
    }
    console.log('Todo by ID ', todo);
    console.log('\n');
}).catch((e) => {
    console.log(e);
});


User.findById('5935f7bc65a272192ca5183a').then((user) => {
    if (!user) {
        return console.log('Fak no user found .|.');
    } else {
        console.log(JSON.stringify(user, null, 2));
        console.log();
    }
}, (err) => {
    console.log(err);
});
