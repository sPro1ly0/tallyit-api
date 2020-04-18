/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe.only('Games Endpoints', function () {
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

  describe('POST /api/games', () => {
    beforeEach('insert groups', () => {
      return db
        .into('tallyit_groups')
        .insert(testGroups);
    });

    it('responds with 201, creates a new game, and returns new game', () => {
      this.retries(3);
      const testGroup = testGroups[0];
      const newGame = {
        game_name: 'Test Game',
        group_id: testGroup.id
      };
      console.log(newGame);
      return supertest(app)
        .post('/api/games')
        .send(newGame)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.game_name).to.eql(newGame.game_name);
          const expectedDateCreated = new Date().toISOString();
          const actualDate = new Date(res.body.date_created).toISOString();
          expect(actualDate).to.eql(expectedDateCreated); // only error with matching ISOString milliseconds, .sssZ part
          expect(res.body.group_id).to.eql(testGroup.id);
          expect(res.headers.location).to.eql(`/api/games/${res.body.id}`);            
        })
        .expect(res => 
          db
            .from('tallyit_games')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.game_name).to.eql(newGame.game_name);
              const expectedDateCreated = new Date().toISOString();
              const actualDate = new Date(row.body.date_created).toISOString();
              expect(actualDate).to.eql(expectedDateCreated); // only error with matching ISOString milliseconds, .sssZ part
              expect(row.body.group_id).to.eql(testGroup.id);
            })
        );
    });

  });

});