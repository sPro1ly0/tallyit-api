/* eslint-disable no-useless-escape */
const jwt = require('jsonwebtoken');

function makeTestGroups () {
  return [
    {
      id: 1,
      group_name: 'Demo',
      date_created: new Date('2020-01-22T16:28:32.615Z')
    },
    {
      id: 2,
      group_name: 'bestfam123',
      date_created: new Date('2020-04-15T16:28:32.615Z')
    },
    {
      id: 3,
      group_name: 'ssbros',
      date_created: new Date('2020-04-16T16:28:32.615Z')
    },

  ];
}

function makeTestGames(groups) {
  return [
    {
      id: 1,
      game_name: 'Jenga',
      date_created: new Date('2020-04-10T16:28:32.615Z'),
      group_id: groups[0].id,
    },
    {
      id: 2,
      game_name: 'Euchre',
      date_created: new Date('2020-04-12T16:28:32.615Z'),
      group_id: groups[0].id
    },
    {
      id: 3,
      game_name: 'Monopoly',
      date_created: new Date('2020-04-14T16:28:32.615Z'),
      group_id: groups[0].id
    },
    {
      id: 4,
      game_name: 'Uno',
      date_created: new Date('2020-04-15T16:28:32.615Z'),
      group_id: groups[1].id
    }
  ];
}

function makeTestPlayerScores(groups, games) {
  return [
    {
      id: 1,
      player_name: 'Mom',
      score: 1,
      game_id: games[0].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-10T16:28:32.615Z')
    },
    {
      id: 2,
      player_name: 'Dad',
      score: 0,
      game_id: games[0].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-10T16:28:32.615Z')
    },
    {
      id: 3,
      player_name: 'Grandma',
      score: 300,
      game_id: games[1].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-12T16:28:32.615Z'),
    },
    {
      id: 4,
      player_name: 'Luke',
      score: 500,
      game_id: games[1].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-12T16:28:32.615Z'),
    },
    {
      id: 5,
      player_name: 'Leia',
      score: 500,
      game_id: games[1].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-12T16:28:32.615Z'),
    },
    {
      id: 6,
      player_name: 'Grandpa',
      score: 300,
      game_id: games[1].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-12T16:28:32.615Z'),
    },
    {
      id: 7,
      player_name: 'Luke',
      score: 2000,
      game_id: games[2].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-14T16:28:32.615Z'),
    },
    {
      id: 8,
      player_name: 'Leia',
      score: 3000,
      game_id: games[2].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-14T16:28:32.615Z'),
    },
    {
      id: 9,
      player_name: 'Nala',
      score: 3300,
      game_id: games[2].id,
      group_id: groups[0].id,
      date_created: new Date('2020-04-14T16:28:32.615Z'),
    },
    {
      id: 10,
      player_name: 'Bill',
      score: 5,
      game_id: games[3].id,
      group_id: groups[1].id,
      date_created: new Date('2020-04-15T16:28:32.615Z'),
    },
    {
      id: 11,
      player_name: 'Ben',
      score: 3,
      game_id: games[3].id,
      group_id: groups[1].id,
      date_created: new Date('2020-04-15T16:28:32.615Z'),
    },
    {
      id: 12,
      player_name: 'Polly',
      score: 4,
      game_id: games[3].id,
      group_id: groups[1].id,
      date_created: new Date('2020-04-15T16:28:32.615Z'),
    }
  ];
}

function makeTallyitFixtures() {
  const testGroups = makeTestGroups();
  const testGames = makeTestGames(testGroups);
  const testPlayerScores = makeTestPlayerScores(testGroups, testGames);
  return { testGroups, testGames, testPlayerScores };
}

function seedTallyitTables(db, groups, games, player_scores=[]) {
  return db
    .into('tallyit_groups')
    .insert(groups)
    .then(() => 
      db
        .into('tallyit_games')
        .insert(games)
    )
    .then(() =>
      player_scores.length && db.into('tallyit_player_scores').insert(player_scores)
    );
}

function makeExpectedGame(groups, game) {
  const group = groups.find(g => g.id === game.group_id);

  return {
    id: game.id,
    game_name: game.game_name,
    date_created: game.date_created.toISOString(),
    group: group.group_name    
  };
}

function makeExpectedPlayerScores(games, gameId, playerScores) {
  const expectedPlayerScores = playerScores.filter(ps => ps.game_id === gameId);

  return expectedPlayerScores.map(ps => {
    const game = games.find(g => g.id === ps.game_id);
    return {
      id: ps.id,
      player_name: ps.player_name,
      score: Number(ps.score),
      game_id: ps.game_id,
      date_created: ps.date_created.toISOString(),
      date_modified: ps.date_modified || null,
      game: game.game_name
    };
  });
}

function seedGroups(db, groups) {
  return db
    .into('tallyit_groups')
    .insert(groups)
    .then(() => 
      db.raw(
        // eslint-disable-next-line quotes
        `SELECT setval('tallyit_groups_id_seq', ?)`,
        [groups[groups.length - 1].id]
      )
    );
}
  
function makeMaliciousGame(group) {
  const maliciousGame = {
    id: 123,
    game_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    date_created:  new Date().toISOString(),
    group_id: group.id,
  };
  const expectedGame = {
    ...maliciousGame,
    game_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
  };
  return {
    maliciousGame,
    expectedGame
  };
}

function seedMaliciousGame(db, group, game) {
  return seedGroups(db, [group])
    .then(() => 
      db
        .into('tallyit_games')
        .insert([game])
    );
}

function makeMaliciousPlayer(group, game) {
  const maliciousPlayer = {
    id: 321,
    player_name: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    score: 3,
    game_id: game.id,
    group_id: group.id,
    date_created: new Date().toISOString()  
  };
  const expectedPlayer = {
    ...maliciousPlayer,
    player_name: 'Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.'
  };

  return {
    maliciousPlayer,
    expectedPlayer
  };
}

function makeAuthHeader(group, secret=process.env.JWT_SECRET) {
  const token = jwt.sign({ group_id: group.id }, secret, {
    subject: group.group_name,
    algorithm:'HS256'
  });

  return `Bearer ${token}`;
}
  
  
module.exports = { 
  makeTallyitFixtures,
  seedTallyitTables,
  makeExpectedGame,
  makeExpectedPlayerScores,
  seedGroups,
  makeMaliciousGame,
  seedMaliciousGame,
  makeMaliciousPlayer,
  makeAuthHeader
};