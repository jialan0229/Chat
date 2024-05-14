const { dbQuery } = require('../../models/dbQuery');
const { ResData, ResWarning, ResError } = require('../../utils/resp');

const getList = (req, res) => {
  ResData(res);
}

const searchUser = async (req, res) => {
  const { username } = req.query;
  try {
    const sqlUser = `SELECT * FROM users WHERE username LIKE ?`;
    const results = await dbQuery(sqlUser, [`%${username}%`]);
    if(results.length) {
      const { id } = req.user;
      const searchList = results.filter(i => i.id != id).map(item => {
        const { id, username, avatar } = item;
        return {
          id,
          username,
          avatar,
          status: 0
        }
      })

      const sql = `SELECT * FROM friends WHERE user_id=?`;
      const userFriendList = await dbQuery(sql, [id]);
      searchList.forEach(item => {
        userFriendList.forEach(friendItem => {
          if(item.id == friendItem.friend_id) {
            // 已添加此用户为好友
            item.status = 1;
          }
        })
      });

      ResData(res, searchList);
    }else {
      ResWarning(res, '无法找到该用户！');
    }
  } catch {
    ResError(res)
  }
}


module.exports = {
  getList,
  searchUser
}