//start program

const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error has occured.');
    }

    console.log('Successfully connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something text written here',
    //     completed: false
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Error happend', error);
    //     } 

    //     console.log(JSON.stringify(result.ops, null, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Vince',
    //     age: 20,
    //     location: 'Davao'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Errer has happened nigguh', err);
    //     }

    //     //console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2));
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2));
    // });
    
    db.close();
});