import "./Old.css";
import { LineChart, Line, YAxis, XAxis } from "recharts";
import { useEffect, useState } from "react";
import {
  randomDarkColor,
  getTimeString,
  getShortDateString,
  toStringFixedLength,
} from "../util/Util";

const teamHeight = 30;

var teamDataCache = {};

function Old() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);

  const [data, setData] = useState([]);
  const [maxmin, setmaxmin] = useState({});
  const [maxRank, setMaxRank] = useState(1);
  const [colors, setColors] = useState({});
  const [teams, setTeams] = useState([]);

  const [chosenTeam, setChosenTeam] = useState("");
  const [teamData, setTeamData] = useState({});
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [errorTeam, setErrorTeam] = useState(null);

  let processData = (data) => {
    let days = data.time.length;
    let newData = [];
    let teams = Object.keys(data.teams);
    let len = teams.length;
    let newTeams = [];
    let maxmin = {};
    let colors = {};
    let newMaxRank = len;
    for (let i = 0; i < days; i++) {
      newData[i] = {};
      newData[i]["time"] = data.time[i];
      newData[i]["date"] = getShortDateString(data.time[i]);
      teams.forEach((team, idx) => {
        let rank = data.teams[team][i];
        if (!rank) rank = teams.length + 1;
        if (!maxmin[team]) maxmin[team] = { max: 0, min: len };
        maxmin[team].max = Math.max(maxmin[team].max, rank);
        maxmin[team].min = Math.min(maxmin[team].min, rank);
        if (rank > newMaxRank) newMaxRank = rank;
        newData[i][team] = rank;
        if (i === days - 1) newTeams[rank] = team;
        if (i === days - 1) colors[team] = randomDarkColor();
      });
    }
    setMaxRank(newMaxRank);
    setmaxmin(maxmin);
    setTeams(newTeams);
    setData(newData);
    setColors(colors);
  };

  let chooseTeam = (team) => {
    setLoadingTeam(true);
    if (teamDataCache[team]) {
      setTeamData(teamDataCache[team]);
      setLoadingTeam(false);
    }

    setChosenTeam(team);

    fetch(`https://some-server.ynng.ca/team-info?team=${team}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        console.log(data);
        teamDataCache[team] = data;
        setTeamData(data);
      })
      .catch((error) => {
        console.error("error fetching team data: ", error);
        setErrorTeam(error);
      })
      .finally(() => {
        setLoadingTeam(false);
      });
  };

  useEffect(() => {
    fetch("https://some-server.ynng.ca/all?season=change-up", {
      // mode: "no-cors",
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        processData(data);
      })
      .catch((error) => {
        console.error("error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });

    let myScrollTop = 0;
    //Scrolling
    function onScroll() {
      let currentPosition = window.pageYOffset;
      if (Math.abs(currentPosition - myScrollTop) > 100) {
        myScrollTop = currentPosition <= 0 ? 0 : currentPosition;
        setScrollTop(myScrollTop);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return "Loading....";
  if (error) return "Error!";

  console.log("Rendering Home");

  return (
    <div className="main-wrapper">
      <div className="graph-wrapper">
        <LineChart
          width={data.length * 50}
          height={(maxRank + 0.7) * teamHeight}
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 20,
            bottom: 0,
          }}
          className="team-rankings"
        >
          {teams.map((item) => {
            if (
              maxmin[item].min >
              (scrollTop + window.innerHeight + window.innerHeight) / teamHeight
            )
              return null;
            if (
              maxmin[item].max <
              (scrollTop - window.innerHeight) / teamHeight
            )
              return null;

            return (
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey={item}
                stroke={colors[item]}
                dot={{ fill: colors[item] }}
                strokeWidth={2}
                key={item}
                className={[item === chosenTeam ? "selected" : ""]}
              />
            );
          })}
          {chosenTeam.length > 0 ? (
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey={chosenTeam}
              stroke={colors[chosenTeam]}
              dot={{ fill: colors[chosenTeam] }}
              strokeWidth={15}
              key={chosenTeam + "_selected"}
              className={["selected"]}
            />
          ) : null}
          <YAxis
            type={"number"}
            orientation={"right"}
            reversed
            tickCount={1}
            domain={[1, teams.length - 1]}
          />
          <XAxis dataKey="date" />
        </LineChart>
      </div>
      <div className="ticks">
        {teams.map((item, idx) => (
          <p
            key={item}
            onClick={() => {
              chooseTeam(item);
            }}
            className={[item === chosenTeam ? "selected" : ""]}
          >
            {idx} - {item}
          </p>
        ))}
      </div>
      <div className="info-panel">
        <p className="small-text">By <a href="https://ynng.ca">Ynng</a></p>
        <p>
          last updates {getTimeString(Date.now() - data[data.length - 1].time)}{" "}
          ago
        </p>
        {chosenTeam ? (
          <div className="team-title">
            <a href={`https://www.robotevents.com/teams/VRC/${chosenTeam}`}>
              <h1>{chosenTeam}</h1>
              <h2>{loadingTeam ? "..." : teamData.team.teamName}</h2>
            </a>
          </div>
        ) : (
          <h1>No Team Selected</h1>
        )}
        {chosenTeam ? (
          <>
            <ul className="team-info">
              <h2>
                <li>
                  <span className="title">Score:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                  ${teamData.scores.score} | ${toStringFixedLength(
                          teamData.scores.combinedStopTime,
                          2,
                          true
                        )}s`}
                  </span>
                </li>
                <li>
                  <span className="title">Prog:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                  ${teamData.scores.programming}
                  `}
                  </span>
                </li>
                <li>
                  <span className="title">Driver:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                  ${teamData.scores.driver}
                  `}
                  </span>
                </li>
                <li>
                  <br />
                </li>
                <li>
                  <span className="title">Best Prog:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                    ${getShortDateString(
                      teamData.scores.progScoredAt
                    )}:${toStringFixedLength(
                          teamData.scores.maxProgramming,
                          5,
                          true
                        )} | ${toStringFixedLength(
                          teamData.scores.progStopTime,
                          2,
                          true
                        )}s`}
                  </span>
                </li>
                <li>
                  <span className="title">Best Driver:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                      ${getShortDateString(
                        teamData.scores.driverScoredAt
                      )}:${toStringFixedLength(
                          teamData.scores.maxDriver,
                          5,
                          true
                        )} | ${toStringFixedLength(
                          teamData.scores.driverStopTime,
                          2,
                          true
                        )}s`}
                  </span>
                </li>
                <li>
                  <br />
                </li>
              </h2>
              <h3>
                <li>
                  <span className="title">Region:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                  ${teamData.team.eventRegion}`}
                  </span>
                </li>
                <li>
                  <span className="title">Location:</span>
                  <span className="score">
                    {loadingTeam
                      ? "..."
                      : `
                  ${teamData.team.country}, ${teamData.team.region}, ${teamData.team.city}`}
                  </span>
                </li>
              </h3>
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
export default Old;
