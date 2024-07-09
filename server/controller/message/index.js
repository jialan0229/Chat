const { dbQuery } = require('../../models/dbQuery');
const {
  nanoid,
  ResData,
  ResError,
  ResWarning
} = require('../../utils/index');
let rooms = {};

const getList = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const sql = 'SELECT * FROM friends WHERE friend_id = ? ORDER BY updated_at DESC'
    const result = await dbQuery(sql, [userId]);
    /* result.sort((a, b) => {
      let t1 = new Date(a.updated_at).getTime()
      let t2 = new Date(b.updated_at).getTime()
      if (t1 < t2) {
        return 1; // a 应该排在 b 前面
      } else if (t1 > t2) {
        return -1; // a 应该排在 b 后面
      } else {
        return 0; // a 和 b 相等，位置不变
      }
    }); */
    for (let i = 0; i < result.length; i++) {
      let sql = `SELECT content, sender_id FROM messages WHERE room=? ORDER BY created_at DESC LIMIT 1;`
      let sql2 = `SELECT * FROM messages WHERE status=0 AND room=?;`
      let lastInfo = await dbQuery(sql, [result[i].room]);
      let unreads = await dbQuery(sql2, [result[i].room]);
      result[i].lastMsg = lastInfo?.[0].content;
      result[i].lastMsgSenderId = lastInfo?.[0].sender_id;
      result[i].unread = unreads.length;
    }

    ResData(res, result)
  } catch (error) {
    ResError(res)
  }
}

const getChatList = async (ws, req) => {
  const { room, sender_id } = req.query;
  const sqlSenderId = `SELECT * FROM messages WHERE room=? ORDER BY created_at ASC`;
  const result = await dbQuery(sqlSenderId, [room]);
  if (!rooms[room]) {
    rooms[room] = {}
  }

  rooms[room][sender_id] = ws;
  ws.send(JSON.stringify(result))

  ws.on('message', async (msg) => {
    const message = {
      ...JSON.parse(msg),
      id: nanoid(),
      status: 0,
      created_at: new Date()
    };

    const sqlInset = `INSERT INTO messages set ?`;
    await dbQuery(sqlInset, message);
    for (const key in rooms[message.room]) {
      // 给接受者/发送者 发送消息
      rooms[room][key].send(JSON.stringify(message))
    }
  })
}

const updateStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if(!id) {
      return ResWarning(res, '参数错误', 4000)
    }
    const sql = `UPDATE messages SET status = 1 WHERE id = ?`
    const result = await dbQuery(sql, [id]);
    if(result.changedRows) {
      ResData(res);
    } else {
      ResWarning(res, '当前数据不存在', 1005)
    }
  } catch (error) {
    ResError(res)
  }
}

module.exports = {
  getList,
  getChatList,
  updateStatus
}