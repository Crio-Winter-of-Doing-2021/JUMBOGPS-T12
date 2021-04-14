const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
let server = require('../../server');

// assertion style
chai.should();

chai.use(chaiHttp);

// test cases checking for unauthorized api calls
describe('Unauthorized API Calls for Assets', () => {
    /**
     * GET endpoints
     */
    describe('GET /api/assets', () => {
        // findAll endpoint
        it('GET /api/assets => 401', (done) => {
            chai.request(server)
            .get('/api/assets')
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });

        // findOne endpoint
        it('GET /api/assets/?id=<id> => 401', (done) => {
            let testId = 'A101';
            chai.request(server)
            .get('/api/assets/?id='+testId)
            .end((err, res) => {
                if (err) console.log(err);
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
    describe('POST /api/assets', () => {
        it('POST /api/assets => 401', (done) => {
            let testAsset = {
                id: "A102",
                name: "Asset 2",
                type: "Truck",
                src: "-71.39386, 42.2990573",
                dest: "-77.52701, 38.8016286",
                start: "2021-01-01T08:45:58",
                end: "2021-01-01T09:25:58",
                ts: "2021-01-01T08:45:58",
                long: -71.39386,
                lat: 42.2990573
            };

            chai.request(server)
            .post('/api/assets')
            .send(testAsset)
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });

    /**
     * PATCH endpoints - unrestricted
     */

    /**
     * DELETE endpoints
     */
    describe('DELETE /api/assets', () => {
        it('DELETE /api/assets/?id=<id> => 401', (done) => {         

            chai.request(server)
            .delete('/api/assets')
            .query({id: 'A102'})
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Unauthorized access');
                done();
            });
        });
    });
});