const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

const {ObjectId} = require('mongodb');

Todo.remove({}).then((todoAll) => {
    console.log('Success');
    console.log(todoAll);
});

Todo.findOneAndRemove({
    _id: '5937a8f55249550c1cb5bf05'
}).then((todo1R) => {
    console.log('Success');
    console.log(todo1R);
});

Todo.findByIdAndRemove('5937a774928a9230dcddf1f0').then((todoId) => {
    console.log('Success');
    console.log(todoId);
});