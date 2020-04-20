const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getGroupWithName(db, group_name) {
    return db('tallyit_groups')
      .where({ group_name })
      .first();
  },
  createJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  }
};
  
module.exports = AuthService;