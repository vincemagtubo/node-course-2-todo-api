const {SHA256} = require ('crypto-js');
const jwt = require ('jsonwebtoken');

var data = {
    id: 4
};

var token = jwt.sign(data, 'test');
console.log('token: ', token);

var decoded = jwt.verify(token, 'test');
console.log('decoded ', decoded, '\nid: ', decoded.id, '\niat: ', decoded.iat);


//
console.log('\n');
console.log('***Another way');

var message = 'test post';
var hash = SHA256(message).toString();

console.log('1: ', message, '\n2: ', hash);

var data = {
    id: 4
};

var token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'test_vince').toString()
};

//error will output
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(data) + 'test_vince').toString();

if (resultHash === token.hash) {
    console.log('All good');
} else {
    console.log('No good');
}

