const session = require('express-session');
const sessionKey = require('../secure/session_key.json');

module.exports = session({
  secret: sessionKey.key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
});