const JWT_SECRET_KEY = 'your-secret-key';
const jwt = require('jsonwebtoken');

// JWT验证中间件
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken
