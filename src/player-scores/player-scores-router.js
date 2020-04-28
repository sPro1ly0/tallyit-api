/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const PlayerScoresService = require('./player-scores-service');
const { requireAuth } = require('../middleware/jwt-auth');

const playerScoresRouter = express.Router();
const jsonParser = express.json();

playerScoresRouter
  .route('/')
  .all(requireAuth)
  .post(jsonParser, (req, res, next) => {
    const { player_name, game_id } = req.body;
    const newPlayer = { player_name, game_id };

    for (const [key, value] of Object.entries(newPlayer)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
      }
    }

    newPlayer.group_id = req.group.id;
    newPlayer.date_created = new Date();
    // score default is 0
    PlayerScoresService.createPlayerScore(
      req.app.get('db'),
      newPlayer
    )
      .then(player => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${player.id}`))
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
        // do not need to check if id matches an existing id in the player_scores table
        // if id does not match, then it will be ignored
        // focus on updating score property
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
  .all(requireAuth)
  .all(checkPlayerExists)
  .delete((req, res, next) => {
    PlayerScoresService.deletePlayer(
      req.app.get('db'),
      req.params.player_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkPlayerExists(req, res, next) {
  try {
    const player = await PlayerScoresService.getById(
      req.app.get('db'),
      req.params.player_id
    );

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
