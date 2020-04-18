const xss = require('xss');

const GamesService = {
  createGame (db, newGame) {
    return db
      .insert(newGame)
      .into('tallyit_games')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  serializeGame (game) {
    return {
      id: game.id,
      game_name: xss(game.game_name),
      date_created: new Date(game.date_created),
      group_id: game.group_id
    };
  }
};

module.exports = GamesService;