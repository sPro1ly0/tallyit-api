/* eslint-disable no-unused-vars */
// post new player and score, yes
// delete player and score, yes
// patch/put players and scores
// already using games endpoint to get player scores per game, yes
const express = require('express');
const path = require('path');
const PlayerScoresService = require('./player-scores-service');

const playerScoresRouter = express.Router();
const jsonParser = express.json(); // only parses json
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

  })
  .patch(jsonParser, (req, res, next) => {
    // expecting an array
    const playerScores = req.body;
    playerScores.forEach((ps) => {
      ps.date_modified = new Date();

      PlayerScoresService.updatePlayerScore(
        req.app.get('db'),
        ps.id,
        ps
      )
        .then(() => {
          res.status(204).end();
        })
        .catch(next);
    });
  });

playerScoresRouter
  .route('/:player_id')
  .all(checkPlayerExists)
  .delete((req, res, next) => {
    PlayerScoresService.deletePlayer(
      req.app.get('db'),
      req.params.player_id
    )
      .then(() => {
        res.status(204).end();
        logger.info(`Player with id ${req.params.player_id} deleted.`);
      })
      .catch(next);
  });

async function checkPlayerExists (req, res, next) {
  try {
    const player = await PlayerScoresService.getById(
      req.app.get('db'),
      req.params.player_id
    );
      // console.log(player);
    if (!player) {
      return res.status(404).json({
        error: { message: 'Player does not exist' }
      });
    }
    
    res.player = player;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = playerScoresRouter;
