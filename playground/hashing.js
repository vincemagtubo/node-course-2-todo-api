const {SHA256} = require ('crypto-js');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');



var password = '123ABCabc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('PW: ', password, '\nSalt: ', salt, '\nHashed: ', hash);
    });
});

var hashedPW = '$2a$10$KvdkPjoPDELhaZ552xJheuKBM782DT4V35xeSDC2TqKuwCgrzuDQK';
bcrypt.compare(password, hashedPW, (err, res) => {
    console.log(res);
});




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

