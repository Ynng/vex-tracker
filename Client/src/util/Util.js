let getTimeString = (duration) => {
  let totalSeconds = duration / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  if (days)
    return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  if (hours) return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  if (minutes) return `${minutes} minutes ${seconds} seconds`;
  return `${seconds} seconds`;
};

let randomColor = () => {
  var letters = "123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++)
    color += letters[Math.floor(Math.random() * letters.length)];
  return color;
};

export { getTimeString, randomColor };
