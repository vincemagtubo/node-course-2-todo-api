const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const todos = [{
    _id: new ObjectId(),
    text: 'First test'
}, {
    _id: new ObjectId(),
    text: 'Second test'
}, {
    _id: new ObjectId(),
    text: 'Third test'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

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

//POTA
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


describe('DELETE /todos/:_todoIDrmv', () => {
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