
const ResData = (res, data = null, code = 0) => {
  res.json({
    code,
    data,
    msg: 'success'
  })
}

const ResWarning = (res, msg, code = 1001) => {
  res.json({
    code,
    data: null,
    msg: msg
  })
}

const ResError = (res) => {
  res.json({
    code: 500,
    data: null,
    msg: '服务器内部错误'
  })
}

module.exports = {
  ResData,
  ResWarning,
  ResError
}