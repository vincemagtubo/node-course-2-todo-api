//start program

const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error has occured.');
    }

    console.log('Successfully connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectId('592db72859b0961638c5cf88')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });

    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectId('592b0723810607148c2bbd5a')
        }, { 
            $set: {
                name: 'Kimberly'
        }, $inc: {
                age: 3
            }
        }, {
            returnOriginal: false
        }).then((res) => {
            console.log(res);
        });

    //db.close();
});