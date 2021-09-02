'use stricts'
import chai from 'chai';
import chaiHttp from 'chai-http';

const expect = chai.expect;
chai.use(chaiHttp);

const {
    PORT
} = process.env;

const port = PORT || 3001;
const url = `http://localhost:${port}/api`;

describe('Find a user with id 1: ', () => {
    it('should return a user data with id 1', (done) => {
        chai.request(url)
            .get('/users/1')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Update user name and lastname with id 1: ', () => {
    it('should update user name and lastname with id 1', (done) => {
        chai.request(url)
            .put('/users/1')
            .send({ first_name: "User edit", last_name: "Edit" })
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                chai.request(url)
                    .get('/users/1')
                    .end(function (err, res) {
                        console.log(res.body)
                        expect(res).to.have.status(200);
                        done();
                    });
            });
    });
});

describe('Delete user with id 1:  ', () => {
    it('should delete user with id 1', (done) => {
        chai.request(url)
            .delete('/users/1')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Delete user with error:  ', () => {
    it('should recived a error', (done) => {
        chai.request(url)
            .delete('/users/1')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('Another case delete user with error:  ', () => {
    it('should recived a error', (done) => {
        chai.request(url)
            .delete('/users/test')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(500);
                done();
            });
    });
});

describe('Find a user with id 1 with error: ', () => {
    it('should return a error', (done) => {
        chai.request(url)
            .get('/users/1')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('Find a user with id test with error: ', () => {
    it('should return a error', (done) => {
        chai.request(url)
            .get('/users/test')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(500);
                done();
            });
    });
});

describe('Find a users with ids 1,2,3,4,5,6,7,8,9,10: ', () => {
    it('should return an array of users only with the users that exist if the other users do not exist these will be created', (done) => {
        chai.request(url)
            .get('/users/1,2,3,4,5,6,7,8,9,10')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Find a users with ids 1,2,3,4,5,6,7,8,9,10: ', () => {
    it('should return an array of users', (done) => {
        chai.request(url)
            .get('/users/1,2,3,4,5,6,7,8,9,10')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Find a user with id 1,100 test with error: ', () => {
    it('should return a error', (done) => {
        chai.request(url)
            .get('/users/1,100')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(500);
                done();
            });
    });
});

describe('Find a users with ids 1,2,3,4,5 and sort_by: ', () => {
    it('should return an array of users sort by last_name', (done) => {
        chai.request(url)
            .get('/users/1,2,3,4,5?&sort_by=last_name')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Find a users with ids 1,2,3,4,5 and sort_by and order: ', () => {
    it('should return an array of users sort by last_name and ordered DESC', (done) => {
        chai.request(url)
            .get('/users/1,2,3,4,5?&sort_by=last_name&order=desc')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Find a users with ids 1,2,3,4,5 and sort_by and order: ', () => {
    it('should return an array of users sort by last_name and ordered ASC', (done) => {
        chai.request(url)
            .get('/users/1,2,3,4,5?&sort_by=last_name&order=asc')
            .end(function (err, res) {
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });
    });
});