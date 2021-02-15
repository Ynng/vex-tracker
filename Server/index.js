const readline = require('readline');
const fs = require('fs');
const startFetch = require('./fetch.js');
var express = require('express');
const { savePath } = require('./config.json');

var rl = readline.createInterface(process.stdin, process.stdout);
var app = express();

app.get('/', (req, res, next) => {
  res.json('Hello World');
});

app.get('/ranking', (req, res, next) => {
  if (!req.query.date) {
    res.json({ status: 404 });
    return;
  }
  console.log(req.query.date);
  if (!fs.existsSync(`${savePath}${req.query.date}.json`)) {
    res.json({ status: 404 });
    return;
  }

  try {
    data = fs.readFileSync(`${savePath}${req.query.date}.json`, 'utf8');
    databases = JSON.parse(data);
    res.json(databases);
    return;
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }

  res.json({ status: 404 });
  return;
});

// start a server on port 80
const server = app.listen(80, () => {
  const port = server.address().port;
  console.log('app listening on port', port);
});

startFetch();

rl.on('SIGINT', () => {
  rl.question('Exit Program (y or n)? ', (input) => {
    if (input.match(/^y(es)?$/i)) {
      rl.pause();
      process.exit(0);
    }
  });
});
