// post new player and score, yes
// delete player and score
// patch players and scores
// already using games endpoint to get player scores per game, yes
const express = require('express');
const path = require('path');
const PlayerScoresService = require('./player-scores-service');

const playerScoresRouter = express.Router();
const jsonParser = express.json();
const logger = require('../logger');

playerScoresRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { player_name, game_id, group_id } = req.body;
    const newPlayer = { player_name, game_id };

    for (const [key, value] of Object.entries(newPlayer)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    newPlayer.group_id = group_id;
    newPlayer.date_created = new Date();

    PlayerScoresService.createPlayerScore(
      req.app.get('db'),
      newPlayer
    )
      .then(player => {
        logger.info(`Player with id ${player.id} created`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${player.id}`))
          .json(PlayerScoresService.serializePlayerScore(player));
      })
      .catch(next);

  });

module.exports = playerScoresRouter;
