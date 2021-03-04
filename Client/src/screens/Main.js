import "./Main.css";

import {
  randomDarkColor,
  getTimeString,
  getShortDateString,
  toStringFixedLength,
} from "../util/Util";
import { useEffect, useState } from "react";
import { ResponsiveBump } from "@nivo/bump";

function Main() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [dates, setDates] = useState([]);

  let processData = (data) => {
    let days = data.time.length;
    let newData = [];
    let teams = Object.keys(data.teams);
    let newTeams = [];
    let newDates = [];
    let newDisplayData;

    //Accurate date:
    // data.time.forEach((time, idx) => {
    //   newDates[idx] = getShortDateString(time);
    // });

    //"Fake pretty" date, guaranteed once a day
    let curDay = data.time[0];
    data.time.forEach((time, idx) => {
      curDay += 1000 * 60 * 60 * 24;
      newDates[idx] = getShortDateString(curDay);
    });

    teams.forEach((team, idx) => {
      newData[idx] = { id: team, data: [], curScore: 0 };
      data.teams[team].forEach((score, jdx) => {
        newData[idx].data[jdx] = { x: newDates[jdx], y: score };
        newData[idx].curScore = score;
      });
    });

    newData.sort((a, b) => {
      //smaller first
      return a.curScore - b.curScore;
    });

    setTeams(newTeams);
    setData(newData);
    setDates(newDates);

    newDisplayData = newData.slice(0, 20);
    setDisplayData(newDisplayData);

    console.log(newDisplayData);
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
  }, []);

  if (loading) return "Loading....";
  if (error) return "Error!";

  return (
    <div className="main-wrapper">
      <ResponsiveBump
        data={displayData}
        margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
        colors={{ scheme: "category10" }}
        lineWidth={3}
        activeLineWidth={6}
        inactiveLineWidth={3}
        inactiveOpacity={0.15}
        pointSize={10}
        activePointSize={16}
        inactivePointSize={0}
        pointColor={{ theme: "background" }}
        pointBorderWidth={3}
        activePointBorderWidth={3}
        pointBorderColor={{ from: "serie.color" }}
        animate={false}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -36,
        }}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "ranking",
          legendPosition: "middle",
          legendOffset: -40,
        }}
      />
    </div>
  );
}

export default Main;
