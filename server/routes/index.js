module.exports = (app) => {
  const auth = require('./modules/auth');
  const message = require('./modules/message');

  // app.use('/', router);
  app.use('/api/auth', auth);
  app.use('/api/message', message);
};
