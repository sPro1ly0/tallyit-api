/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const gamesRouter = require('./games/games-router');
const playerScoresRouter = require('./player-scores/player-scores-router');
const groupsRouter = require('./groups/groups-router');
const authRouter = require('./auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// );

app.use('/api/games', gamesRouter);

app.use('/api/player-scores', playerScoresRouter);

app.use('/api/groups', groupsRouter);

app.use('/api/auth', authRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV=== 'production') {
    response = { error: {message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;