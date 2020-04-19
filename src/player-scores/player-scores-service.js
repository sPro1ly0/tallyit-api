const xss = require('xss');

const PlayerScoresService = {
  createPlayerScore(db, newPlayer) {
    return db
      .insert(newPlayer)
      .into('tallyit_player_scores')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
      .then(playerScore =>
        PlayerScoresService.getById(db, playerScore.id)
      );
  },
  getById(db, id) {
    return db
      .from('tallyit_player_scores AS ps')
      .select(
        'ps.id',
        'ps.player_name',
        'ps.score',
        'ps.game_id',
        'ps.date_created',
        'ps.date_modified',
        'g.game_name AS game'            
      )
      .leftJoin(
        'tallyit_games AS g',
        'ps.game_id',
        'g.id'
      )
      .groupBy('ps.id', 'g.id')
      .where('ps.id', id)
      .first();
  },
  deletePlayer(db, id) {
    return db
      .from('tallyit_player_scores')
      .where({ id })
      .delete();
  },
  serializePlayerScore(playerScore) {
    return {
      id: playerScore.id,
      player_name: xss(playerScore.player_name),
      score: Number(playerScore.score),
      game_id: playerScore.game_id,
      date_created: new Date(playerScore.date_created),
      date_modified: playerScore.date_modified || null,
      game: playerScore.game
    };
  }
};

module.exports = PlayerScoresService;