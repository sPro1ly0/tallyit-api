/* eslint-disable quotes */
const express = require('express');
const path = require('path');
const GroupsService = require('./groups-service');
const GamesService = require('../games/games-service');
const { requireAuth } = require('../middleware/jwt-auth');
const groupsRouter = express.Router();
const jsonParser = express.json();

groupsRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const groupId = req.group.id;
    GroupsService.getGroupName(
      req.app.get('db'),
      groupId
    )
      .then(group => {
        return res.json(group);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { group_name } = req.body;

    if (!group_name) {
      return res.status(400).json({
        error: `Missing 'group_name' in request body`
      });
    }

    const groupError = GroupsService.validateGroup(group_name);

    if (groupError) {
      return res.status(400).json({
        error: groupError
      });
    }

    GroupsService.hasGroup(
      req.app.get('db'),
      group_name
    )
      .then(hasGroupAlready => {
        if (hasGroupAlready) {
          return res.status(400).json({ error: 'Group name already taken' });
        }

        const newGroup = {
          group_name,
          date_created: 'now()'
        };

        return GroupsService.createGroup(
          req.app.get('db'),
          newGroup
        )
          .then(group => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${group.id}`))
              .json(GroupsService.serializeGroup(group));
          });
      })
      .catch(next);
  });

groupsRouter
  .route('/games')
  .get(requireAuth, (req, res, next) => {
    const groupId = req.group.id;
    GroupsService.getGamesForGroup(
      req.app.get('db'),
      groupId
    )
      .then(games => {
        res.json(games.map(game => GamesService.serializeGame(game)));
      })
      .catch(next);      
  });

module.exports = groupsRouter;