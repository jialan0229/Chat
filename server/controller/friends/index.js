const { dbQuery } = require('../../models/dbQuery');
const { 
  nanoid, 
  ResData, 
  ResWarning, 
  ResError 
} = require('../../utils/index');

const getList = (req, res) => {
  ResData(res);
}

// 查询用户名称
const searchUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const sqlUser = `SELECT * FROM users WHERE username LIKE ?`;
    const results = await dbQuery(sqlUser, [`%${username}%`]);
    if (results.length) {
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
        userFriendList.forEach(async friendItem => {
          if (item.id == friendItem.friend_id) {
            // 已添加此用户为好友
            item.status = 1;
          }
        })
      });

      ResData(res, searchList);
    } else {
      ResWarning(res, '无法找到该用户！');
    }
  } catch {
    ResError(res)
  }
}

const addFriend = async (req, res) => {
  try {
    const user = req.user
    const { id, username } = req.body;
    const room = nanoid();
    // 将对方添加为好友
    const object = {
      id: nanoid(),
      user_id: user.id,
      friend_id: id,
      username: user.username,
      remark: user.username,
      room
    };
    // 将当前用户添加为对方好友
    const object2 = {
      id: nanoid(),
      user_id: id,
      friend_id: user.id,
      username,
      remark: username,
      room
    }

    const results = await addFriendSQL(object);
    const results2 = await addFriendSQL(object2);
    
    const message = {
      id: nanoid(),
      sender_id: user.id,
      receiver_id: id,
      room,
      content: '我已添加你为好友，现在我们可以开始聊天了！！！',
      status: 0,
      created_at: new Date()
    };

    const sqlInset = `INSERT INTO messages set ?`;
    await dbQuery(sqlInset, message);
    // for (const key in rooms[message.room]) {
    //   // 给接受者/发送者 发送消息
    //   rooms[room][key].send(JSON.stringify(message))
    // }

    if (results.affectedRows && results2.affectedRows) {
      ResData(res, object);
    }else {
      ResWarning(res, '创建失败！')
    }
  } catch {
    ResError(res)
  }
}

const addFriendSQL = async (object) => {
  const sql = `INSERT INTO friends SET ?`
  return await dbQuery(sql, object);
}




module.exports = {
  getList,
  searchUsername,
  addFriend
}