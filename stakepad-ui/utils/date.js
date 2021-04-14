// 获取当前时间，day为number，getDay(-1),表示昨天的日期
export function getDay(day) {
  const today = new Date();
  const dayBefore30Days = new Date()
  dayBefore30Days.setDate(today.getDate() - 30)
  const targetdayMilliseconds = dayBefore30Days.getTime() + 1000 * 60 * 60 * 24 * day;
  const newDate = new Date(targetdayMilliseconds);
  // const tYear = newDate.getFullYear();
  const tMonth = newDate.getMonth();
  const tDate = newDate.getDate();
  const newtMonth = doHandleMonth(tMonth + 1);
  const newtDate = doHandleMonth(tDate);
  return newtMonth + "-" + newtDate;
};

function doHandleMonth(month) {
  if (month.toString().length == 1) {
      return "0" + month;
  }
  return month;
}