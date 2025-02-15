const md5 = require('md5');
const jwt = require('jsonwebtoken');
const multiavatar = require('@multiavatar/multiavatar');
const { nanoid, ResData, ResWarning, ResError } = require('../../utils/index');
const { dbQuery } = require('../../models/dbQuery');

const JWT_SECRET_KEY = 'goldFlash0927';

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return ResWarning(res, '请输入用户名或密码', 1002)
  }

  const sql = `SELECT * FROM users WHERE username = ?`;
  const results = await dbQuery(sql, [username]);
  if (!results.length || results[0].password !== md5(password)) {
    return ResWarning(res, '用户名或密码错误', 1001)
  } else {
    const payload = {
      ...results[0]
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 7 * 24 * 60 * 60 * 1000 });
    const data = {
      ...results[0],
      token
    }
    ResData(res, data)
  }
}

// //注册
// router.post("/api/register", async function (req, res, next) {
//   const { username, password } = req;
//   if(!(username && password)) {
//     return res.json({ code: 4000, msg: "参数错误" });
//   }

//   try {
//     // 判断用户名或手机号是否已经注册
//     const sql_check = `SELECT username, password, phone FROM users WHERE username = ?`;
//     const results_check = await  connection.query(sql_check, [username]);

//     if (results_check.length) {
//       return res.json({
//         code: 1003,
//         data: null,
//         msg: '用户名或手机号已注册'
//       });
//     }

//     // 插入当前用户注册信息
//     const sql_set_user = `INSERT INTO users SET ?`;
//     // const avatar = multiavatar(username);
//     // password: md5(password),
//     const user = {
//       username,
//       password,
//     };

//     await connection.query(sql_set_user, user);
//     // 查询当前用户注册信息
//     const sql_get_user = `SELECT * FROM users WHERE username = ?`;
//     const data = await connection.query(sql_get_user, [username])[0];
//     res.json({
//       code: 0,
//       data,
//       msg: '注册成功'
//     })
//   } catch {
//     res.json({
//       code: 500,
//       data: null,
//       msg: '服务器内部错误'
//     });
//   }
// })

// //登录
// router.post("api/login", asycn (req, res, next) => {
//   const { username, password } = req.body;
//   if(!(username && password)) {
//     return res.send('请输入用户名或密码')
//   }

//   const sql = `SELECT * FROM users WHERE username = ?`;
//   const results = await connection.query(sql, [username]);
//   if(!results.length || results[0].password !== password) {
//     return res.json({
//       code: 1001,
//       data: '',
//       msg: '用户名或密码错误'
//     })
//   }else {
//     const payload = {
//       ...results[0]
//     }

//     // const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn:  7 * 24 * 60 * 60 * 1000 });
//     res.json({
//       code: 0,
//       data: {
//         ...results[0],
//         // token
//       },
//       msg: '登录成功'
//     });
//   }
// })

const register = async (req, res) => {
  const { username, password, phone } = req.body;
  if (!(username && password && phone)) {
    return ResWarning(res, '参数错误', 4000)
  }
  try {
    // 判断用户名或手机号是否已经注册
    const sql_check = `SELECT username, password, phone FROM users WHERE username = ? OR phone = ?`;
    const results_check = await dbQuery(sql_check, [username, phone]);
    if (results_check.length) {
      return ResWarning(res, '用户名或手机号已注册', 1003)
    }

    // 插入当前用户注册信息
    const sql_set_user = `INSERT INTO users SET ?`;
    // const avatar = multiavatar(username);
    const user = {
      id: nanoid(),
      avatar: '',
      username,
      password: md5(password),
      name: username,
      phone,
      signature: '',
      salt: ''
    };

    await dbQuery(sql_set_user, user);
    // 查询当前用户注册信息
    const sql_get_user = `SELECT * FROM users WHERE username = ?`;
    const data = await dbQuery(sql_get_user, [username])[0];
    ResData(res, data)
  } catch {
    ResError(res);
  }
}

module.exports = {
  login,
  register
};