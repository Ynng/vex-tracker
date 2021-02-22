let toDate = (str, format) => {
  var normalized = str.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems = normalizedFormat.split('-');
  var dateItems = normalized.split('-');

  var monthIndex = formatItems.indexOf('mm');
  var dayIndex = formatItems.indexOf('dd');
  var yearIndex = formatItems.indexOf('yyyy');
  var hourIndex = formatItems.indexOf('hh');
  var minutesIndex = formatItems.indexOf('ii');
  var secondsIndex = formatItems.indexOf('ss');

  var today = new Date();

  var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
  var month =
    monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
  var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();

  // var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHout();
  var hour = hourIndex > -1 ? dateItems[hourIndex] : 0;
  // var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
  var minute = minutesIndex > -1 ? dateItems[minutesIndex] : 0;
  // var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();
  var second = secondsIndex > -1 ? dateItems[secondsIndex] : 0;

  return new Date(year, month, day, hour, minute, second);
};

module.exports = { toDate };
