import "./Home.css";
import { LineChart, Line, YAxis, XAxis } from "recharts";
import { useEffect, useState } from "react";

let randomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
};

function Home() {
  const [data, setData] = useState([]);
  const [maxmin, setmaxmin] = useState({});
  const [colors, setColors] = useState({});
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollTop, setScrollTop] = useState(0);

  let processData = (data) => {
    let days = data.time.length;
    let newData = [];
    let teams = Object.keys(data.teams);
    let len = teams.length;
    let newTeams = [];
    let maxmin = {};
    let colors = {};
    for (let i = 0; i < days; i++) {
      newData[i] = {};
      newData[i]["time"] = data.time[i];
      teams.forEach((team, idx) => {
        let rank = data.teams[team][i];
        if (!rank) rank = teams.length + 1;
        if (!maxmin[team]) maxmin[team] = { max: 0, min: len };
        maxmin[team].max = Math.max(maxmin[team].max, rank);
        maxmin[team].min = Math.min(maxmin[team].min, rank);
        newData[i][team] = rank;
        if (i === days - 1) newTeams[rank] = team;
        if (i === days - 1) colors[team] = randomColor();
      });
    }
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

  if (loading) return "Loading....";
  if (error) return "Error!";

  return (
    <>
      <LineChart
        width={data.length * 50}
        height={teams.length * 20}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {teams.map((item, idx) => {
          if (
            maxmin[item].min >
            (scrollTop + window.innerHeight + window.innerHeight) / 20
          )
            return null;
          if (maxmin[item].max < (scrollTop - window.innerHeight) / 20)
            return null;
          return (
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey={item}
              stroke={colors[item]}
              strokeWidth={2}
              key={item}
            />
          );
        })}
        <YAxis
          type={"number"}
          orientation={"right"}
          reversed
          interval={1}
          domain={[0, teams.length]}
        />
        <XAxis dataKey="time" />
        {/* <Tooltip /> */}
      </LineChart>
    </>
  );
}
export default Home;
