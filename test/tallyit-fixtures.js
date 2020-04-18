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
  
  
  
  
module.exports = { 
  makeTallyitFixtures
};