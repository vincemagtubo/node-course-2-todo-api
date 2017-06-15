const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user.js');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo list', (done) => {
        var text = 'Testing of todo list motherfucer';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
      });
});

//SHITE
// describe('POST /todos', () => {
//     it('should not create todo with invalid body data', (done) => {
//         request(app)
//             .post('/todos')
//             .send({})
//             .expect(400)
//             .end((err, res) => {
//             if (err) {
//                 return done(err);
//             }

//             Todo.find().then((todos) => {
//                 expect(todos.length).toBe(2);
//                 done();
//             }).catch((e) => done(e));
//             });
//         });
// });

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:todoID', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._todoID.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('shoulda return 404 if todo not found', (done) => {
        var hexID = new ObjectId().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('shoulda fuckin return 404 for non-objs id', (done) => {
        request(app)
            .get('/todos/123invalid')
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:todoIDrmv', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._todoIDrmv._id).toBe(hexID)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexID).then((_testrmv) => {
                    expect(_testrmv).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('shoulda return 404 if todo not found', (done) => {
        var hexID = new ObjectId().toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it ('shoulda return 404 if todo not valid yo', (done) => {
        request(app)
            .delete('/todos/123invalid')
            .expect(404)
            .end(done);
    });
});


describe('PATCH /todos/:todoIDupd', () => {
    it ('shoulda update the todo', (done) => {
        var hexID = todos[0]._id.toHexString();
        var updText = 'This is a changed text';

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text: updText,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body._todoIDupd.text).toBe(updText);
                expect(res.body._todoIDupd.completed).toBe(true);
                expect(res.body._todoIDupd.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('shoulda clear completedAt when todo aint completed', (done) => {
        var hexID = todos[1]._id.toHexString();
        var updText = 'Also a new text should be saved. This';
        var updCompleted = false;
        
        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                text: updText,
                completed: updCompleted
            })
            .expect(200)
            .expect((res) => {
                expect(res.body._todoIDupd.text).toBe(updText);
                expect(res.body._todoIDupd.completed).toBe(updCompleted);
                expect(res.body._todoIDupd.completedAt).toNotExist();
            })
            .end(done);
    });
});


//------------USERS------------



describe('GET /users/me', () => {
    it('should return users if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /users', () => {
    it('should create new user', (done) => {
        var email = 'example@outlook.com';
        var password = 'password_test';
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                } else {
                    User.findOne({email}).then((userTest) => {
                        expect(userTest).toExist();
                        expect(userTest.password).toNotBe(password);
                        done();
                    }).catch((err) => done(err));
                }
            });

    });


    it('should return validation errers if req invalid', (done) => {
        var email = 'johnjohn.com';
        var password = '123';
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email is in use', (done) => {
        var body = {
            email: users[0].email,
            password: users[0].password
        };

        request(app)
            .post('/users')
            .send({body})
            .expect(400)
            .end(done);
    });
});



describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
         var body = {
             email: users[1].email,
             password: users[1].password
         };

        request(app)
            .post('/users/login')
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    }).catch((err) => done(err));
                }
            });
    });

    it('should reject invalid log fucker', (done) => {
        var body = {
            email: 'vincevince',
            password: 'abc'
        };

        request(app)
            .post('/users/login')
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    User.findById(users[1]._id).then((testUserLog) => {
                        expect(testUserLog.tokens.length).toBe(0);
                        done();
                    }).catch((err) => done());
                }
            })
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                } else {
                    User.findById(users[0]._id).then((userDelete) => {
                        expect(userDelete.tokens.length).toBe(0);
                        done();
                    }).catch((err) => done(err));
                }
            });
    });
});