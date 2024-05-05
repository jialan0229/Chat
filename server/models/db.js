const mysql = require('mysql');

const config = require('./config.js');

const db = mysql.createPool(config);

db.query('SELECT 1 + 1 AS solution', error => {
  if (error) {
    console.log('MySQL 连接失败:', error.message);
    return;
  }

  console.log('MySQL 连接成功');
})

module.exports = db