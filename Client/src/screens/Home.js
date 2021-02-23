import "./Home.css";
import { LineChart, Line, YAxis, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { randomDarkColor, getTimeString } from "../util/Util";
import dateformat from "dateformat";

const teamHeight = 30;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function Home() {
  const [data, setData] = useState([]);
  const [maxmin, setmaxmin] = useState({});
  const [colors, setColors] = useState({});
  const [chosenTeam, setChosenTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [ticks, setTicks] = useState([]);

  let processData = (data) => {
    let days = data.time.length;
    let newData = [];
    let teams = Object.keys(data.teams);
    let len = teams.length;
    let newTeams = [];
    let maxmin = {};
    let colors = {};
    let ticks = [];
    for (let i = 0; i < days; i++) {
      newData[i] = {};
      newData[i]["time"] = data.time[i];
      let date = new Date(data.time[i]);
      newData[i]["date"] = `${monthNames[date.getMonth()]} ${date.getDate()}`;
      teams.forEach((team, idx) => {
        let rank = data.teams[team][i];
        if (!rank) rank = teams.length + 1;
        if (!maxmin[team]) maxmin[team] = { max: 0, min: len };
        maxmin[team].max = Math.max(maxmin[team].max, rank);
        maxmin[team].min = Math.min(maxmin[team].min, rank);
        newData[i][team] = rank;
        if (i === days - 1) newTeams[rank] = team;
        if (i === days - 1) colors[team] = randomDarkColor();
        if (i === days - 1) ticks[rank] = rank;
      });
    }
    setTicks(ticks);
    setmaxmin(maxmin);
    setTeams(newTeams);
    setData(newData);
    setColors(colors);
    console.log(newData);
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

  let chooseTeam = (team) => {
    
    
    setChosenTeam(team);
  };

  if (loading) return "Loading....";
  if (error) return "Error!";

  console.log("Rendering Home");

  return (
    <div className="main-wrapper">
      <LineChart
        width={data.length * 50}
        height={(teams.length + 0.7) * teamHeight}
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
          if (maxmin[item].max < (scrollTop - window.innerHeight) / teamHeight)
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
            key={chosenTeam}
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
        <p>
          Graph last updates{" "}
          {getTimeString(Date.now() - data[data.length - 1].time)}
        </p>
        <a
          href={`https://www.robotevents.com/teams/VRC/${chosenTeam}`}
          className="team"
        >
          <h1>{chosenTeam}</h1>
        </a>
      </div>
    </div>
  );
}
export default Home;
