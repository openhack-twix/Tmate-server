const auth = require('../routes/auth');
const user = require('../routes/user');

module.exports = exports = function(app) {
  app.use('/api/auth',auth);
  app.use('/api/user',user);
}