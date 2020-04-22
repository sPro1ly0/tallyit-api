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
  getPlayerScoresForGame(db, game_id) {
    return db
      .from('tallyit_player_scores AS ps')
      .select(
        'ps.id',
        'ps.player_name',
        'ps.score',
        'ps.game_id',
        'ps.date_created',
        'ps.date_modified'
      )
      .where('ps.game_id', game_id);
  },
  serializeGame(game) {
    return {
      id: game.id,
      game_name: xss(game.game_name),
      date_created: new Date(game.date_created),
      group: game.group
    };
  },
  serializePlayerScore(playerScore) {
    return {
      id: playerScore.id,
      player_name: xss(playerScore.player_name),
      score: Number(playerScore.score),
      game_id: playerScore.game_id,
      date_created: new Date(playerScore.date_created),
      date_modified: playerScore.date_modified || null,
    };
  }
};

module.exports = GamesService;