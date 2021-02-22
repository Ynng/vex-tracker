const fs = require('fs');
var dateformat = require('dateformat');
const {
  rankingUrl,
  savePath,
  debug,
  dataPath,
  startingDate,
  currentSeason,
} = require('./config.json');
const fetch = require('node-fetch');
const { toDate } = require('./util');

if (!globalThis.fetch) globalThis.fetch = fetch;

async function fetchInfo() {
  /* Beginning */
  functionStartTime = new Date();

  /* Fetching */
  response = await fetch(rankingUrl);

  /* Parsing JSON */
  json = await response.json();

  /* Mapping object */
  let mapped = { teams: {}, ranking: {}, time: functionStartTime.valueOf() };
  json.forEach((item) => {
    teamNumber = item.team.team;
    mapped['teams'][teamNumber] = item;
    mapped['teams'][teamNumber]['scores']['driverScoredAt'] = Date.parse(
      item.scores.driverScoredAt
    );
    mapped['teams'][teamNumber]['scores']['progScoredAt'] = Date.parse(
      item.scores.progScoredAt
    );
    mapped['ranking'][item.rank] = teamNumber;
  });

  /* stringify */
  let saveJson = JSON.stringify(mapped, null, 4);

  /* Saving */
  var today = dateformat(functionStartTime, 'yyyy-mm-dd');
  try {
    fs.writeFileSync(`${savePath}${today}.json`, saveJson, 'utf8');
  } catch {
    console.error(err);
  }

  /* Generate all data file */
  var targetDate = toDate(startingDate, 'yyyy-mm-dd');
  var all = { teams: {}, time: [] };
  var i = 0;
  while (targetDate <= functionStartTime) {
    var targetDateString = dateformat(targetDate, 'yyyy-mm-dd');
    if (fs.existsSync(`${savePath}${targetDateString}.json`)) {
      //Read
      try {
        let snapshot = fs.readFileSync(
          `${savePath}${targetDateString}.json`,
          'utf8'
        );
        let data = JSON.parse(snapshot);
        all.time[i] = data.time;

        for (const team in data.teams) {
          if (!all.teams[team]) all.teams[team] = [];
          all.teams[team][i] = data.teams[team].rank;
        }
      } catch (err) {
        console.error(err);
      }
    }
    i++;
    targetDate.setDate(targetDate.getDate() + 1);
  }
  //Write
  try {
    let saveJson = JSON.stringify(all, null, 4);
    fs.writeFileSync(`${dataPath}${currentSeason}.json`, saveJson, 'utf8');
  } catch (err) {
    console.error(err);
  }

  /* Ending */
  functionEndTime = new Date();
  console.log(
    `function took ${((functionEndTime - functionStartTime) / 1000).toFixed(
      2
    )}s, wrote to ${today}.json`
  );
}

async function start() {
  fs.mkdir(savePath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.mkdir(dataPath, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await fetchInfo();
  return setInterval(async function () {
    await fetchInfo();
  }, 24 * 60 * 60 * 1000);
}

module.exports = async function startFetch() {
  var now = new Date(Date.now());
  var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0,
    0,
    0 // ...at 00:00:00 hours
  );
  var msTillMidnight = night.getTime() - now.getTime();
  if (debug) msTillMidnight = 0;

  console.log(
    `Waiting for ${(msTillMidnight / 1000).toFixed(1)}s or ${(
      msTillMidnight /
      1000 /
      60
    ).toFixed(1)}m until midnight`
  );

  setTimeout(function () {
    start();
  }, msTillMidnight);
};
