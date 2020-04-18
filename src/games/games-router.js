const express = require('express');
const path = require('path');
const GamesService = require('./games-service');

const gamesRouter = express.Router();
const jsonParser = express.json();
const logger = require('../logger');

gamesRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const { game_name, group_id } = req.body;
    const newGame = { game_name };

    if (newGame.game_name == null) {
      return res.status(400).json({
        error: { message: 'Missing game_name in request body'}
      });
    }

    newGame.group_id = group_id;
    newGame.date_created = new Date();

    GamesService.createGame(
      req.app.get('db'),
      newGame
    )
      .then(game => {
        logger.info(`Game with id ${game.id} created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${game.id}`))
          .json(GamesService.serializeGame(game));
      })
      .catch(next);
  });

gamesRouter
  .route('/:game_id')
  .all(checkGameExists)
  .get((req, res) => {
    res.json(GamesService.serializeGame(res.game));
  });

async function checkGameExists (req, res, next) {
  try {
    const game = await GamesService.getGameById(
      req.app.get('db'),
      req.params.game_id
    );
  
    if (!game) {
      return res.status(404).json({
        error: { message: 'Game does not exist' }
      });
    }
  
    res.game = game;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = gamesRouter;