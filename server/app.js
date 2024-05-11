const createError = require('http-errors');
const http = require('http');
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const router = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 跨域
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 导入路由前 初始化 express-ws
const server = http.createServer(app);
expressWs(app, server, {
  wsOptions:
    { 
      // 最大支持5G聊天记录 1MB(1024 * 1024) 1G(1024 * 1024 * 1024)
      maxPayload: 5 * 1024 * 1024 * 1024 
    }
});

// 注册路由
router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app,
  server,
};
