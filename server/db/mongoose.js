var mongoose = require('mongoose');

// //--thought so
//const{MongoClient, ObjectId} = require('mongodb');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// //--thought so
// MongoClient.connect('mongodb://vince:password@ds111262.mlab.com:11262/todoapitutorial', (err, db) => {
//     if (err) {
//         return console.log('Error happened');
//     } else {
//         console.log('Succesfully connected to MongoLab');
//     }
// });

module.exports = {
    mongoose,
    // //--thought so--
    //MongoClient
};