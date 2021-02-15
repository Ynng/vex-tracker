const fs = require('fs');
const { rankingUrl, savePath, debug } = require('./config.json');
const fetch = require('node-fetch');

if (!globalThis.fetch) globalThis.fetch = fetch;

module.exports = async function fetchInfo() {
  /* Beginning */
  functionStartTime = Date.now() / 1000;

  /* Fetching */
  fetchTime = Date.now() / 1000;
  startTime = fetchTime;
  response = await fetch(rankingUrl);
  endTime = Date.now() / 1000;
  if (debug)
    console.log(
      `fetched at ${startTime}, took ${(endTime - startTime).toFixed(2)}`
    );

  /* Parsing JSON */
  startTime = Date.now() / 1000;
  json = await response.json();
  endTime = Date.now() / 1000;
  if (debug) console.log(`json parse took ${(endTime - startTime).toFixed(2)}`);

  /* Mapping object */
  startTime = Date.now() / 1000;
  let mapped = { teams: {}, ranking: {}, time: fetchTime * 1000 };
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
  endTime = Date.now() / 1000;
  if (debug) console.log(`mapping took ${(endTime - startTime).toFixed(2)}`);

  /* stringify */
  startTime = Date.now() / 1000;
  var saveJson = JSON.stringify(mapped, null, 4);
  endTime = Date.now() / 1000;
  if (debug) console.log(`stringify took ${(endTime - startTime).toFixed(2)}`);

  /* Saving */
  startTime = Date.now() / 1000;
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  try {
    fs.writeFileSync(`${savePath}${today}.json`, saveJson, 'utf8');
    endTime = Date.now() / 1000;
    if (debug)
      console.log(`writing file took ${(endTime - startTime).toFixed(2)}`);
  } catch {
    console.error(err);
  }

  /* Ending */
  functionEndTime = Date.now() / 1000;
  console.log(
    `function took ${(functionEndTime - functionStartTime).toFixed(2)}s at ${fetchTime*1000}, wrote to ${today}.json`
  );
}