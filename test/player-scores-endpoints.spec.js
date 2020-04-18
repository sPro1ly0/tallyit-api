/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe.only('Player-Scores Endpoints', () => {
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

  describe('POST /api/player-scores', () => {
    beforeEach('insert games', () => 
      fixtures.seedTallyitTables(
        db,
        testGroups,
        testGames
      )
    );

    it('responds 201, creates player with a score default of 0, and returns new player data', function() {
      this.retries(3);
      const testGroup = testGroups[0];
      const testGame = testGames[0];
      const newPlayer = {
        player_name: 'Bob',
        game_id: testGame.id,
        group_id: testGroup.id
      };

      // console.log(newPlayer);
      return supertest(app)
        .post('/api/player-scores')
        .send(newPlayer)
        .expect(201)
        .expect(res => {
        // console.log(res.body);
          /* 
          {
            id: 1,
            player_name: 'Bob',
            score: 0,
            game_id: 1,
            date_created: '2020-04-18T23:18:48.270Z',
            date_modified: null,
            game: 'Jenga'
          }
          */
          expect(res.body).to.have.property('id');
          expect(res.body.player_name).to.eql(newPlayer.player_name);
          expect(res.body.score).to.eql(0);
          expect(res.body.game_id).to.eql(newPlayer.game_id);
          const expectedDateCreated = new Date().toISOString();
          const actualDate = new Date(res.body.date_created).toISOString();
          expect(actualDate).to.eql(expectedDateCreated); // only error with matching ISOString milliseconds, .sssZ part
          expect(res.body.game).to.eql(testGame.game_name);
          expect(res.headers.location).to.eql(`/api/player-scores/${res.body.id}`);
        })
        .expect(res => 
          db
            .from('tallyit_player_scores')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.player_name).to.eql(newPlayer.player_name);
              expect(row.score).to.eql(0);
              expect(row.game_id).to.eql(newPlayer.game_id);
              const expectedDateCreated = new Date().toISOString();
              const actualDate = new Date(row.date_created).toISOString();
              expect(actualDate).to.eql(expectedDateCreated); // only error with matching ISOString milliseconds, .sssZ part
              expect(row.group_id).to.eql(newPlayer.group_id);
            })    
        );

    });
  });

});