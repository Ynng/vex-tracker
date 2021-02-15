const readline = require('readline');
const fs = require('fs');
const fetchInfo = require('./fetch.js');
const { savePath } = require('./config.json');

var rl = readline.createInterface(process.stdin, process.stdout);

var interval;
async function start() {
  fs.mkdir(savePath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await fetchInfo();
  interval = setInterval(async function () {
    await fetchInfo();
  }, 24*60*60*1000);
}

function startAtMidnight() {
  var now = new Date(Date.now());
  var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // the next day, ...
      0, 0, 0 // ...at 00:00:00 hours
  );
  var msTillMidnight = night.getTime() - now.getTime();

  console.log(`Waiting for ${(msTillMidnight/1000).toFixed(1)}s or ${(msTillMidnight/1000/60).toFixed(1)}m until midnight`);

  setTimeout(function () {
    start();
  }, msTillMidnight);
}

startAtMidnight();

rl.on('SIGINT', () => {
  rl.question('Exit Program (y or n)? ', (input) => {
    if (input.match(/^y(es)?$/i)) {
      rl.pause();
      clearInterval(interval);
      process.exit(0);
    }
  });
});
