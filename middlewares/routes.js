const auth = require('../routes/auth');
const user = require('../routes/user');
const room = require('../routes/room');

module.exports = exports = function(app) {
  app.use('/api/auth',auth);
  app.use('/api/user',user);
  app.use('/api/room',room);
}