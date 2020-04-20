/* eslint-disable quotes */
/* eslint-disable no-undef */
const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe('Auth Endpoints', function() {
  let db;

  const { testGroups } = fixtures.makeTallyitFixtures();
  const testGroup = testGroups[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });
    
  after('disconnect from db', () => db.destroy());
    
  before('cleanup', () => {
    return db.raw(
      `TRUNCATE
               tallyit_player_scores,
               tallyit_games,
               tallyit_groups
               RESTART IDENTITY CASCADE`
    );
  });
    
  afterEach('cleanup', () => {
    return db.raw(
      `TRUNCATE
               tallyit_player_scores,
               tallyit_games,
               tallyit_groups
               RESTART IDENTITY CASCADE`
    );
  });

  describe('POST /api/auth/login', () => {
    beforeEach('insert groups', () =>
      fixtures.seedGroups(
        db,
        testGroups
      )
    );


    it(`responds with 400 and an error message when the 'group_name' is missing`, () => {
          
      const loginAttempt = {};

      return supertest(app)
        .post('/api/auth/login')
        .send(loginAttempt)
        .expect(400, {
          error: `Missing 'group_name' in request body`
        });
    });

    it(`reponds with 400 and 'Incorrect group name' when wrong group name entered`, () => {
      const invalidGroup = { group_name: 'wrong group' };
      return supertest(app)
        .post('/api/auth/login')
        .send(invalidGroup)
        .expect(400, { error: 'Incorrect group name' });
    });

    it('responds 200 and JWT token using secret when valid login', (done) => {
      done(); // avoid error timeout when running test
      const validLogin = {
        group_name: testGroup.group_name
      };
  
      const expectedToken = jwt.sign(
        { group_id: testGroup.id }, // payload
        process.env.JWT_SECRET, // secret
        {
          subject: testGroup.group_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: 'HS256'
        }
      );
  
      return supertest(app)
        .post('/api/auth/login')
        .send(validLogin)
        .expect(200, {
          authToken: expectedToken
        });
    });

  });

});