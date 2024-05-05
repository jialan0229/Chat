const { dbQuery } = require('../../models/dbQuery');

const login = async (req, res) => {
  const { username, password } = req.body;
  if(!(username && password)) {
    return res.send('请输入用户名或密码')
  }

  const sql = `SELECT * FROM user WHERE username = ?`;
  const results = await dbQuery(sql, [username]);
  if(!results.length || results[0].password !== password) {
    return res.json({
      code: 1001,
      data: '',
      message: '用户名或密码错误'
    })
  }else {
    res.json({
      code: 0,
      data: {
        username,
        password
      },
      message: '登录成功'
    });
  }
}

const register = async (req, res) => {
  const { username, password, phone } = req.body;
  if(!(username && password && phone)) {
    return res.json({
      code: 4000,
      data: null,
      message: '参数错误'
    });
  }
  try {
    // 判断用户名或手机号是否已经注册
		const sql_check = `SELECT username, password, phone FROM user WHERE username = ? OR phone = ?`;
		const results_check = await dbQuery(sql_check, [username, phone]);
    if (results_check.length) {
			return res.json({
        code: 1003,
        data: null,
        message: '用户名或手机号已注册'
      });
		}

    // 插入当前用户注册信息
    const sql_set_user = `INSERT INTO user SET ?`;
    const user = {
			avatar: '',
			username,
			password,
			name: username,
			phone,
			signature: '',
			salt: ''
		};
    const results = await dbQuery(sql_set_user, user);

    // 查询当前用户注册信息
    const sql_get_user = `SELECT * FROM user WHERE username = ?`;
    const data = await dbQuery(sql_get_user, [username])[0];
    res.json({
      code: 0,
      data,
      message: '注册成功'
    })
  } catch {
    res.json({
      code: 500,
      data: null,
      message: '服务器内部错误'
    });
  }
}

module.exports = {
  login,
  register
};