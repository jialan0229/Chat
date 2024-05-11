const mysql = require('mysql');

const config = require('./config.js');

const db = mysql.createPool(config);

db.query('SELECT 1 + 1 AS solution', error => {
  if (error) {
    console.log('MySQL 连接失败:', error.message);
    return;
  }

  initUserTable();
  console.log('MySQL 连接成功');
})

// 初始化用户表
function initUserTable() {
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
    initFriendTable();
    initMessageTable();
  })
}

// 初始化好友列表
function initFriendTable() {
  // 创建好友列表表的SQL语句
  const createFriendTable = `
  CREATE TABLE IF NOT EXISTS friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT(10) NOT NULL,
    friend_id INT(10) NOT NULL,
    username VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    remark VARCHAR(255),
    room VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(createFriendTable, (err, result, fields) => {
    if (err) throw err;
    console.log('好友表创建成功');
  })
}

// 初始化聊天记录表
function initMessageTable() {
  // 创建聊天记录表的SQL语句
  const createMessageTable = `
  CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT(10) NOT NULL,
    receiver_id INT(10) NOT NULL,
    content VARCHAR(255),
    type TINYINT(3) DEFAULT 0 COMMENT '0:文本消息，1:图片消息',
    room VARCHAR(255) NOT NULL,
    status TINYINT(3) DEFAULT 0 COMMENT '0:未读，1:已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(createMessageTable, (err, result, fields) => {
    if (err) throw err;
    console.log('聊天记录表创建成功');
  })
}


module.exports = db