module.exports = (app) => {
  const auth = require('./modules/auth');
  const friend = require('./modules/friend');
  const message = require('./modules/message');

  // app.use('/', router);
  app.use('/api/auth', auth);
  app.use('/api/friend', friend);
  app.use('/api/message', message);
};
