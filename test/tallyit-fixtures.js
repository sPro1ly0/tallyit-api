function makeTestGroups () {
  return [
    {
      id: 1,
      group_name: 'Demo'
    },
    {
      id: 2,
      group_name: 'bestfam123'
    }
  ];
}

function makeTestGames() {
  return [
    {
      id: 1,
      game_name: 'Jenga',
      group_id: 1,
      date_played: 'Mon Apr 10 2020 12:00:00 GMT-0500 (Eastern Standard Time)',
    },
    {
      id: 2,
      game_name: 'Euchre',
      group_id: 1,
      date_played: 'Mon Apr 10 2020 12:00:00 GMT-0500 (Eastern Standard Time)',
    },
    {
      id: 3,
      game_name: 'Monopoly',
      group_id: 1,
      date_played: 'Fri Feb 14 2020 12:00:00 GMT-0500 (Eastern Standard Time)'
    }
  ];
}

function makeTestPlayerScores() {
  return [
    {
      id: 1,
      player_name: 'Mom',
      game_id: 1,
      score: 1
    },
    {
      id: 2,
      player_name: 'Dad',
      game_id: 1,
      score: 0
    },
    {
      id: 3,
      player_name: 'Grandma',
      game_id: 3,
      score: 300
    },
    {
      id: 4,
      player_name: 'Luke',
      game_id: 3,
      score: 1000
    },
    {
      id: 5,
      player_name: 'Leia',
      game_id: 3,
      score: 500
    },
    {
      id: 6,
      player_name: 'Grandpa',
      game_id: 2,
      score: 10
    },
    {
      id: 7,
      player_name: 'Luke',
      game_id: 2,
      score: 20
    },
    {
      id: 8,
      player_name: 'Leia',
      game_id: 2,
      score: 20
    },
    {
      id: 9,
      player_name: 'Nala',
      game_id: 2,
      score: 10
    }
  ];
}
  
  
  
  
module.exports = { 
  makeTestGroups, 
  makeTestGames, 
  makeTestPlayerScores 
};