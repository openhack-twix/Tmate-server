// const auth = require('../routes/auth');

// const user = require('../routes/user');
const auth = require('../routes/auth');
const room = require('../routes/room');

module.exports = exports = function(app) {
  // app.use('/api/auth',auth);
  // app.use('/api/users',user);
  app.use('/auth',auth);
  app.use('/api/rooms',room);
}