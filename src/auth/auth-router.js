/* eslint-disable quotes */
const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonParser = express.json();

authRouter
  .post('/login', jsonParser, (req, res, next) => {
    const { group_name } = req.body;


    if (!group_name) {
      return res.status(400).json({
        error: `Missing 'group_name' in request body`
      });
    }

    AuthService.getGroupWithName(
      req.app.get('db'),
      group_name
    )
      .then(dbGroup => {
        if (!dbGroup) {
          return res.status(400).json({
            error: 'Incorrect group name'
          });
        }

        const sub = dbGroup.group_name;
        const payload = { group_id: dbGroup.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });

      })
      .catch(next);

  });

module.exports = authRouter;