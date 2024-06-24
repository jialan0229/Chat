const { dbQuery } = require('../../models/dbQuery');
let rooms = {};

const getList = async (req, res) => {
  const userId = req.user.id;
  const sql = ' SELECT * FROM friends WHERE friend_id = ? ORDER BY updated_at DESC'
  const result = await dbQuery(sql, [userId]);
  result.sort((a, b) => {
    let t1 = new Date(a.updated_at).getTime()
    let t2 = new Date(b.updated_at).getTime()

    if (t1 < t2) {
        return 1; // a 应该排在 b 前面
    } else if (t1 > t2) {
        return -1; // a 应该排在 b 后面
    } else {
        return 0; // a 和 b 相等，位置不变
    }
  });

  res.json({
    code: 0,
    data: result,
    msg: 'success'
  })
}

const getChatList = async (ws, req) => {
  const { room, sender_id } = req.query;
  const sqlSenderId = `SELECT * FROM messages WHERE room=?`;
  const result = await dbQuery(sqlSenderId, [room]);
  if(!rooms[room]) {
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

module.exports = {
  getList,
  getChatList
}