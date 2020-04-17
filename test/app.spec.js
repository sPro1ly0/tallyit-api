const app = require('../src/app');

describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
    });
    it(`GET /api/* responds with 200 with JSON object {"ok": true}`, () => {
        return supertest(app)
            .get('/api/*')
            .expect(200, {"ok": true})
    });
});