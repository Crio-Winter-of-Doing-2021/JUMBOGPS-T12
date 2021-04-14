const chai = require('chai');
const chaiHttp = require('chai-http');
let server = require('../../server');

// assertion style
chai.should();

chai.use(chaiHttp);

// test cases checking for unauthorized api calls
describe('Authorized API Calls for Assets', () => {
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

    /**
     * PATCH endpoints
     */

    /**
     * DELETE endpoints
     */
});