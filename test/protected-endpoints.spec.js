/* eslint-disable quotes */
/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe.only('Protected Endpoints', function() {
  let db;

  const { testGroups, testGames, testPlayerScores } = fixtures.makeTallyitFixtures();

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

  beforeEach('insert data into tables', () =>
    fixtures.seedTallyitTables(
      db,
      testGroups,
      testGames,
      testPlayerScores
    )
  );

  const protectedEndpoints = [
    {
      name: 'POST /api/games',
      path: '/api/games',
      method: supertest(app).post
    },
    {
      name: 'GET /api/games/:game_id',
      path: '/api/games/1',
      method: supertest(app).get
    },
    {
      name: 'DELETE /api/games/:game_id',
      path: '/api/games/1',
      method: supertest(app).delete
    },
    {
      name: 'GET /api/games/:game_id/player-scores',
      path: '/api/games/1/player-scores',
      method: supertest(app).get
    },
    {
      name: 'POST /api/player-scores',
      path: '/api/player-scores',
      method: supertest(app).post
    },
    {
      name: 'PATCH /api/player-scores',
      path: '/api/player-scores',
      method: supertest(app).patch
    },
    {
      name: 'DELETE /api/player-scores/:player_id',
      path: '/api/player-scores/:player_id',
      method: supertest(app).delete
    },
    // {
    //   name: 'GET /api/groups',
    //   path: '/api/groups',
    //   method: supertest(app).get
    // },
    // {
    //   name: 'GET /api/groups/games',
    //   path: '/api/groups/games',
    //   method: supertest(app).get
    // },
    {
      name: 'POST /api/auth/refresh',
      path: '/api/auth/refresh',
      method: supertest(app).post
    }    
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });

      it(`responds with 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validGroup = testGroups[0];
        const invalidSecret = 'very-very-bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', fixtures.makeAuthHeader(validGroup, invalidSecret))
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds with 401 'Unauthorized request' when invalid sub in payload`, function(done) {
        done();
        const invalidCreds = { group_name: 'bad-group-name', id: 1 };
        return endpoint.method(endpoint.path)
          .set('Authorization', fixtures.makeAuthHeader(invalidCreds))
          .expect(401, { error: `Unauthorized request` });
      });

    });
  });

});