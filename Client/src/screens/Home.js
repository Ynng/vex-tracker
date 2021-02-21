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
  const [data, setData] = useState({});
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let processData = (data) => {
    let len = data.time.length;
    let newData = [];
    let newTeams = Object.keys(data.teams);
    setTeams(newTeams);
    for (let i = 0; i < len; i++) {
      newData[i] = {};
      newData[i]["time"] = data.time[i];
      newTeams.forEach((key) => {
        if(!data.teams[key][i]){
          console.log(`${key} null`);
          data.teams[key][i] = newTeams.length + 1;
        }
        newData[i][key] = data.teams[key][i];
      });
    }
    setData(newData);
    console.log(newData);
  };

  useEffect(() => {
    fetch("http://140.238.159.27/all?season=change-up", {
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
  }, []);

  if (loading) return "Loading....";
  if (error) return "Error!";

  return (
    <LineChart
      width={data.length * 50}
      height={teams.length * 20}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      {teams.map((item) => {
        return (
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey={item}
            stroke={randomColor()}
            strokeWidth={2}
            key={item}
          />
        );
      })}
      <YAxis type={"number"} orientation={"right"} reversed />
      <XAxis dataKey="time" />
      {/* <Tooltip /> */}
    </LineChart>
  );
}
export default Home;
