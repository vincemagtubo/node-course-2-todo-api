//start program

const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error has occured.');
    }

    console.log('Successfully connected to MongoDB server');

    //FINDING USING AN OBJ.ID
    db.collection('Todos').find({
       _id: new ObjectId('592b0ff168a545fc442e9a50')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to find fucker', err);
    });

    //COUNTING NUMBER
    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to find fucker', err);
    });

    
    db.collection('Users').find({
        name: 'Vince'
    }).toArray().then((docs) => {
        console.log(`Found:`);
        console.log(JSON.stringify(docs, null, 2));
    }, (err) => {
        console.log('Seems like something is wron`', err);
    });
    
    //db.close();
});