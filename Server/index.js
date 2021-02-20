const readline = require('readline');
const fs = require('fs');
const startFetch = require('./fetch.js');
var express = require('express');
const { savePath, rankingPath } = require('./config.json');

var rl = readline.createInterface(process.stdin, process.stdout);
var app = express();

app.set('json spaces', 0);

app.get('/ranking', (req, res, next) => {
  if (!req.query.date) {
    res.status(400).json({
      message: 'Please submit the date query in the format of YYYY-M-D',
    });
    return;
  }

  console.log(req.query.date);

  if (!fs.existsSync(`${rankingPath}${req.query.date}.json`)) {
    if (!fs.existsSync(`${savePath}${req.query.date}.json`)) {
      res
        .status(404)
        .json({ message: 'Does not have a snapshot of the given date' });
      return;
    }
    console.log('Generating ranking file for ' + req.query.date);

    try {
      let snapshot = fs.readFileSync(
        `${savePath}${req.query.date}.json`,
        'utf8'
      );
      let data = JSON.parse(snapshot);
      var ranking = Object.assign([], data.ranking);
      // Get Team id instead of number, probably don't need it.
      // ranking = ranking.map((item) => data.teams[item].team.id);
      ranking.shift();
      var time = data.time;
    } catch (err) {
      console.log(`Error reading file from disk: ${err}`);
      res.status(500).json({ message: 'Error reading files' });
      return;
    }

    try {
      let saveJson = JSON.stringify({ ranking, time }, null, 4);
      fs.writeFileSync(
        `${rankingPath}${req.query.date}.json`,
        saveJson,
        'utf8'
      );
    } catch (err) {
      console.log(`Error writing file: ${err}`);
      res.status(500).json({ message: 'Error writing files' });
      return;
    }
  }

  try {
    let snapshot = fs.readFileSync(
      `${rankingPath}${req.query.date}.json`,
      'utf8'
    );
    let data = JSON.parse(snapshot);
    res.json(data);
    return;
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
    res.status(500).json({ message: 'Error reading files' });
  }
});

// start a server on port 80
const server = app.listen(80, () => {
  const port = server.address().port;
  console.log('app listening on port', port);
});

startFetch();

fs.mkdir(rankingPath, { recursive: true }, (err) => {
  if (err) throw err;
});

rl.on('SIGINT', () => {
  rl.question('Exit Program (y or n)? ', (input) => {
    if (input.match(/^y(es)?$/i)) {
      rl.pause();
      process.exit(0);
    }
  });
});
