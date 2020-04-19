/* eslint-disable quotes */
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
    // score default is 0
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
    // expecting an array of objects due to client side user interface
    // and player_name won't change, focusing on updates to scores
    const playerScores = req.body;

    for (let i = 0; i < playerScores.length; i++) {
      try {
        if (playerScores[i].id == null) {
          return res.status(400).json({
            error: { message: `Request body must have 'id'`}
          });
        }
        // do not need to check if id matches an existing id in the player_scores table
        // if id does not match, then it will be ignored
        if (playerScores[i].score== null) {
          return res.status(400).json({
            error: { message: `Request body must have 'score'`}
          });
        }
        
        playerScores[i].date_modified = new Date();
  
        PlayerScoresService.updatePlayerScore(
          req.app.get('db'),
          playerScores[i].id,
          playerScores[i]
        )
          .then(() => {
            res.status(204).end();
          })
          .catch(next);

      } catch (e) {
        next(e);
        break;
      }      

    }

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

async function checkPlayerExists(req, res, next) {
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
