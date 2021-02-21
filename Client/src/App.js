import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, useEffect, Component } from "react";
import Canvas from "react-responsive-canvas";
import { Route, Switch } from "react-router-dom";
import Home from "./screens/Home";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
