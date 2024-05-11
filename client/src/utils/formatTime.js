
/**
 * @description: 格式化时间
 * @param {*} time
 * @return {*}
 * @author: 0927
 */
export function formatTime(time) {
  if(!time) return;
  // 创建一个Date对象
  const date = new Date(time);

  // 获取月份（0-11表示1-12月），日期，小时，分钟和秒
  const month = zeroFill(date.getMonth() + 1); // getMonth() 返回的月份是从0开始的
  const day = zeroFill(date.getDate());
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // 转换为所需的格式：月-日 时分秒
  // 确保月和日是两位数
  const formattedDate = `${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}


function zeroFill(str) {
  return  str < 10 ?  `0${str}` : str;
}