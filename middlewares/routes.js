const auth = require('../routes/auth');
const room = require('../routes/room');

module.exports = exports = function(app) {
  app.use('/auth',auth);
  app.use('/api/rooms',room);
}