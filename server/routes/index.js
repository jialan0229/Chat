module.exports = (app) => {
  const user = require('./modules/user');
  const auth = require('./modules/auth');
  const message = require('./modules/message');

  // app.use('/', router);
  app.use('/test', user);
  app.use('/api/auth', auth);
  app.use('/api/message', message);
};
