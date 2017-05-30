//start program

const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Error has occured.');
    }

    console.log('Successfully connected to MongoDB server');

    //deleteMANY
    db.collection('Todos').deleteMany({text: 'Where are you dipshit'}).then((result) => {
        console.log(result);
    });

    //deleteOne
    db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((results) => {
        console.log(results);
    });

    //findonethenDELETE
    db.collection('Todos').findOneAndDelete({completed: false}).then((results) => {
        console.log(`Succesfully deletd: `, results);
    });

    db.collection('Users').deleteMany({name: 'Vince'}).then((res) => {
        console.log('Success', res);
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectId('592dae803b3a84deb4e06eb0')}).then((res) => {
        console.log(JSON.stringify(res, null, 2));
    });

    //db.close();
});