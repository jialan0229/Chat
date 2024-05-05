const user = require('./user');
const auth = require('./auth');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = (app) => {
  // app.use('/', router);
  app.use('/test', user);
  app.use('/api/auth', auth);
};
