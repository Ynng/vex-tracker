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

let randomRange = (min, max) => {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
};

let randomDarkColor = () => {
  let h = randomRange(0, 360);
  let s = randomRange(50, 100);
  let l = randomRange(20, 70);
  return hslToHex(h,s,l);
};

let hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export { getTimeString, randomColor, hslToHex, randomRange, randomDarkColor };
