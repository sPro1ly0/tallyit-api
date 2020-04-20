const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getGroupWithName(db, group_name) {
    return db('tallyit_groups')
      .where({ group_name })
      .first();
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    });
  }
};
  
module.exports = AuthService;