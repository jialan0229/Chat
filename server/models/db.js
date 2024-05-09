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

// 创建用户信息表的SQL语句
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  avatar VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  signature VARCHAR(255),
  salt VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
db.query(createUserTable, (err, result, fields) => {
  if (err) throw err;
  console.log('用户表创建成功');
})

module.exports = db