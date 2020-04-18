const xss = require('xss');

const GamesService = {
  createGame(db, newGame) {
    return db
      .insert(newGame)
      .into('tallyit_games')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getGameById(db, id) {
    return db
      .from('tallyit_games AS g')
      .select(
        'g.id',
        'g.game_name',
        'g.date_created',
        'gp.group_name AS group'
      )
      .leftJoin(
        'tallyit_groups AS gp',
        'g.group_id',
        'gp.id'
      )
      .where('g.id', id)
      .first();
  },
  deleteGame(db, id) {
    return db
      .from('tallyit_games')
      .where({ id })
      .delete();
  },
  serializeGame(game) {
    return {
      id: game.id,
      game_name: xss(game.game_name),
      date_created: new Date(game.date_created),
      group: game.group
    };
  }
};

module.exports = GamesService;