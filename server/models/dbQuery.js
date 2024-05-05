const db = require('./db');

// 封装统一的 sql 语句执行函数
function dbQuery(sql, info) {
  return new Promise((resolve, reject) => {
    db.query(sql, info, async (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

module.exports = {
  dbQuery
};
