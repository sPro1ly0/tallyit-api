/* eslint-disable quotes */
/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const fixtures = require('./tallyit-fixtures');

describe.only('Groups Endpoints', function() {
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

  describe('POST /api/groups', () => {

    it('responds 201, creates new group, and returns new group', function() {
      this.retries(5);

      const newGroup = {
        group_name: 'Test Group'
      };

      return supertest(app)
        .post('/api/groups')
        .send(newGroup)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body.group_name).to.eql(newGroup.group_name);
          expect(res.headers.location).to.eql(`/api/groups/${res.body.id}`);
          const expectedDate = new Date().toISOString();
          const actualDate = new Date(res.body.date_created).toISOString();
          expect(actualDate).to.eql(expectedDate); // only error with matching ISOString milliseconds
        })
        .expect(res => 
          db
            .from('tallyit_groups')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.group_name).to.eql(newGroup.group_name);
              const expectedDate = new Date().toISOString();
              const actualDate = new Date(row.date_created).toISOString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    context('Group name validation', () => {
      beforeEach('insert groups', () =>
        fixtures.seedGroups(
          db,
          testGroups
        )
      );

      it(`responds with 400 required when 'group_name' is missing`, () => {
        
        const newTestGroup = {};

        return supertest(app)
          .post('/api/groups')
          .send(newTestGroup)
          .expect(400, {
            error: `Missing 'group_name' in request body`
          });
      });
      
      it(`responds 400 'Group name must be less than 25 characters' when group name is long`, () => {
        const longGroupName = {
          group_name: 'a'.repeat(26)
        };

        return supertest(app)
          .post('/api/groups')
          .send(longGroupName)
          .expect(400, { error: 'Group name must be less than 25 characters' });
      });
      
      it(`responds 400 'Group name must not start or end with empty spaces' when group name starts with space`, () => {
        const spaceGroup = {
          group_name: ' spacefirst'
        };

        return supertest(app)
          .post('/api/groups')
          .send(spaceGroup)
          .expect(400, { error: 'Group name must not start or end with empty spaces' });
      });

      it(`responds 400 'Group name must not start or end with empty spaces' when group name ends with space`, () => {
        const groupSpace = {
          group_name: 'spacend '
        };

        return supertest(app)
          .post('/api/groups')
          .send(groupSpace)
          .expect(400, { error: 'Group name must not start or end with empty spaces' });
      });

    });
  });
});