const { dbQuery } = require('../../models/dbQuery');

const getList = (req, res) => {
  res.json({
    code: 0,
    data: null,
    msg: 'success'
  })
}

module.exports = {
  getList
}