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
  }, 86400000);
}
start();

rl.on('SIGINT', () => {
  rl.question('Exit Program (y or n)? ', (input) => {
    if (input.match(/^y(es)?$/i)) {
      rl.pause();
      clearInterval(interval);
      process.exit(0);
    }
  });
});
