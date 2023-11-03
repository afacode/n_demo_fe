type Time = string | number | Date;

type DateUnit = {
  [key: string]: {
    unit: string;
    time: number | string;
  };
};

type FormatTime = {
  [key: string]: string | number;
};

/**
 *  补零
 * @param t 时间
 * @returns
 */
function _zero(t: number): number | string {
  return t < 10 ? '0' + t : t;
}

/**
 * 带中文日期
 * @param date 时间组合
 * @param format 格式
 * @returns 2022年10月12日12点10分10秒
 */
function _getUnitDate(date: Date, dateTime: FormatTime, format: string): string {
  const DATE_UNIT: DateUnit = {
    Y: { unit: '年', time: dateTime.year },
    M: { unit: '月', time: dateTime.month },
    D: { unit: '日', time: dateTime.day },
    H: { unit: '时', time: dateTime.hour },
    m: { unit: '分', time: dateTime.minute },
    s: { unit: '秒', time: dateTime.second },
    w: { unit: '周', time: _getWeek(date) },
  };
  return format.replace(/(Y|M|D|H|m|s)/g, i => {
    return DATE_UNIT[i].time + DATE_UNIT[i].unit;
  });
}

/**
 * 带横杠、斜杠日期
 * @param date 时间组合
 * @param format 格式
 * @param symbol 返回的符号
 * @returns yyyy-mm-dd hh:mm:ss
 */
function _getFormatDate(dateTime: FormatTime, format: string, symbol: string): string {
  const YMD: DateUnit = {
    Y: { unit: symbol, time: dateTime.year },
    M: { unit: symbol, time: dateTime.month },
    D: { unit: ' ', time: dateTime.day },
    H: { unit: ':', time: dateTime.hour },
    m: { unit: ':', time: dateTime.minute },
    s: { unit: ' ', time: dateTime.second },
  };
  const timer: string = format.replace(/(Y|M|D|H|m|s)/g, i => {
    return YMD[i].time + YMD[i].unit;
  });
  return timer.substring(0, timer.length - 1);
}

/**
 * 返回第几周
 * @param date 时间
 * @returns string | number
 */
function _getWeek(date: Date) {
  // 今天周几，如果是周日，则设为7
  const weekday = date.getDay() & 7;
  // 周1+5天=周六，得到本周6的日期,之所以以每周末的日期为基准，不能用每周日的日期为基准来计算
  // 当前日期的周六的日期
  date.setDate(date.getDate() - weekday + 1 + 5);
  const yearOfW = date.getFullYear();
  // 每年的第一天，年/1/1，参数之中，0代表月份，介于0(1月) ~11(12月)之间的整数，getDay获取星期几同理
  // 第一天的日期，新年第一天
  let firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfWeek = firstDay.getDay();
  let spendDay = 1;
  // 如果第一天不是星期日，那么就找到下一个星期日作为开始
  if (dayOfWeek !== 0) {
    spendDay = 7 - dayOfWeek + 1;
  }

  firstDay = new Date(yearOfW, 0, 1 + spendDay);
  /*
        1.Math.ceil 取大于等于所给值的最小整数
        2.86400000是换算到天的基数，js的时间差值为时间戳，即毫秒数 1000毫秒 * 60秒 * 60分钟* 24小时 = 86400000
        3.date是当前日期，firstDay是当年第一天，周数计算公式就是（当前日期-第一天天数）/7 就是本年的第几周
        4.day是差距天数，week是周数
      */
  const day = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000);
  const week = Math.ceil(day / 7) + 1;
  // console.log(`${firstDay.getFullYear()}年${week}周`);
  return _zero(week);
}

/**
 * 时间格式化
 * @param {date | string | number} time 传入的时间戳 | 时间
 * @param {string} format 返回的格式化时间
 * @param {boolean} isUnit 是否带有中文日期标识符
 * @param {string} symbol 返回格式数据的连接符 // 移动端必须使用 / ，不然时间会有问题，苹果和安卓手机的区别
 */
export function formatDate(time: Time = new Date(), format = 'YMDHms', isUnit = false, symbol = '-'): string {
  const date = isDate(time);
  const dateMethods: FormatTime = {
    year: date.getFullYear(),
    month: _zero(date.getMonth() + 1),
    day: _zero(date.getDate()),
    hour: _zero(date.getHours()),
    minute: _zero(date.getMinutes()),
    second: _zero(date.getSeconds()),
  };

  // 带中文日期
  if (isUnit) return _getUnitDate(date, dateMethods, format);
  // 带横杠、斜杠日期
  return _getFormatDate(dateMethods, format, symbol);
}

/**
 * 判断时间
 * @param {*} time
 * @returns {Date}
 */
export function isDate(time: Time): Date {
  if (time === '' || time === null || time === undefined) return new Date();
  if (Object.prototype.toString.call(time) === '[object Date]') return time as Date;
  if ((typeof time !== 'object' && typeof time === 'string') || typeof time === 'number') {
    if (typeof time === 'string') {
      time = time.replace(/-/g, '/');
    }
    return new Date(time);
  }
  return new Date();
}
