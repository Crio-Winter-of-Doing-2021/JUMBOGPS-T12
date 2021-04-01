const chai = require('chai');
const chaiHttp = require('chai-http');
let server = require('../../server');

// assertion style
chai.should();

chai.use(chaiHttp);

// test cases checking for unauthorized api calls
describe('Unathorized API Calls for Users', () => {
    /**
     * GET endpoints
     */
    describe('GET /api/users', () => {
        // findAll endpoint
        it('GET /api/users => 401', (done) => {
            chai.request(server)
            .get('/api/assets')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });

        // findOne endpoint
        it('GET /api/users/all-users => 401', (done) => {            
            chai.request(server)
            .get('/api/users/all-users')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });

    /**
     * POST endpoints
     */
     describe('POST /api/users', () => {        

        // login endpoint
        it('POST /api/users/login => 401', (done) => {
            let user = {
                id: "user101",
                password: "userPass10101"
            };

            chai.request(server)
            .post('/api/users/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Invalid password');
                done();
            });
        });

        // register endpoint
        it('POST /api/users/register => 401', (done) => {         
            let user = {
                id: "user101",
                name: "New Tracker",
                type: "Tracker",
                password: "trackerPass10101"
            };

            chai.request(server)
            .post('/api/users/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });

    /**
     * PATCH endpoints
     */
    describe('PATCH /api/users', () => {
        it('PATCH /api/users => 401', (done) => {         
            let user = {
                type: "Tracker",
            };

            chai.request(server)
            .patch('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });

    /**
     * DELETE endpoints
     */
     describe('DELETE /api/users', () => {
        it('DELETE /api/users => 401', (done) => {         

            chai.request(server)
            .delete('/api/users')
            .query({id: 'user101'})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });
});