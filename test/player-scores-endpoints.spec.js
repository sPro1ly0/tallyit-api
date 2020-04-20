/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe('Player-Scores Endpoints', () => {
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
        .set('Authorization', fixtures.makeAuthHeader(testGroup))
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

    it('responds 400 and error message when player_name is missing', () => {
      const testGame = testGames[0];
      const newPlayer = {
        player_name: 'Bobby',
        game_id: testGame.id
      };
          
      delete newPlayer['player_name'];
  
      return supertest(app)
        .post('/api/player-scores')
        .send(newPlayer)
        .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
        .expect(400, {
          error: `Missing 'player_name' in request body`
        });
    });

    it('responds 400 and error message when game_id is missing', () => {
      const testGame = testGames[0];
      const newPlayer = {
        player_name: 'Bobby',
        game_id: testGame.id
      };
            
      delete newPlayer['game_id'];
    
      return supertest(app)
        .post('/api/player-scores')
        .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
        .send(newPlayer)
        .expect(400, {
          error: `Missing 'game_id' in request body`
        });
    });

    context('Given an XSS attack on posting player', () => {
      it('removes XSS attack content', () => {
        const testGroup = testGroups[0];
        const testGame = testGames[0];
        const {
          maliciousPlayer,
          expectedPlayer
        } = fixtures.makeMaliciousPlayer(testGroup, testGame);

        return supertest(app)
          .post('/api/player-scores')
          .set('Authorization', fixtures.makeAuthHeader(testGroup))
          .send(maliciousPlayer)
          .expect(201)
          .expect(res => {
            expect(res.body.player_name).to.eql(expectedPlayer.player_name);
          });
      });
    });

  });

  describe('PATCH /api/player-scores', () => {
    context('given player scores are in tables', () => {
      beforeEach('insert player scores into tables', () => {
        fixtures.seedTallyitTables(
          db,
          testGroups,
          testGames,
          testPlayerScores
        );
      });
  
      it('responds 204 and updates the array of scores', function() {
        const game = testGames[0];
        const testPlayer1 = testPlayerScores[0];
        const testPlayer2 = testPlayerScores[1];
  
        const updateScores = [
          {
            id: 1,
            player_name: testPlayer1.player_name,
            score: 100,
            game_id: game.id,
            date_modified: new Date().toISOString()
          },
          {
            id: 2,
            player_name: testPlayer2.player_name,
            score: 99,
            game_id: game.id,
            date_modified: new Date().toISOString()
          }
        ];
  
        const gameId = 1;
        const expectedPlayerScores = fixtures.makeExpectedPlayerScores(
          testGames,
          gameId,
          testPlayerScores
        );
  
        return supertest(app)
          .patch('/api/player-scores')
          .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
          .send(updateScores)
          .expect(204)
          .then(res => 
            supertest(app)
              .get(`/api/games/${gameId}/player-scores`)
              .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
              .expect(expectedPlayerScores)  
          );
      });

      it(`responds 400 when 'id' field is missing in any player_score object`, function(done) {
        done();
        const updateScores = [
          { 
            score: 123
          }
        ];
  
        return supertest(app)
          .patch('/api/player-scores')
          .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
          .send(updateScores)
          .expect(400)
          .catch(
            {
              error: { message: `Request body must have 'id'`}
            }
          );
      });
  
      it(`responds 400 when 'score' field is missing in any player_score object`, function(done) {
        done();
        const updateScores = [
          { 
            id: 1
          }
        ];
  
        return supertest(app)
          .patch('/api/player-scores')
          .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
          .send(updateScores)
          .expect(400)
          .catch(
            {
              error: { message: `Request body must have 'score'`}
            }
          );
      });
    });

  });

  describe('DELETE /api/player-scores/:player_id', () => {
    context('Given no players in database', () => {
      beforeEach(() =>
        fixtures.seedGroups(db, testGroups)
      );

      it('responds 404 when player does not exist', () => {
        const playerId = 321;
        return supertest(app)
          .delete(`/api/player-scores/${playerId}`)
          .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
          .expect(404, {
            error: { message: 'Player does not exist' }
          });
      });
    });

    context('Given player in database', () => {
      beforeEach(() =>
        fixtures.seedTallyitTables(
          db,
          testGroups,
          testGames,
          testPlayerScores
        ) 
      );

      it('responds 204 and deletes the player', () => {
        const deleteId = 1;

        return supertest(app)
          .delete(`/api/player-scores/${deleteId}`)
          .set('Authorization', fixtures.makeAuthHeader(testGroups[0]))
          .expect(204);
      });
    });
  });

});