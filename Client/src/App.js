import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, useEffect, Component } from "react";
import Canvas from "react-responsive-canvas";
import { Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import Old from "./screens/Old";
import Main from "./screens/Main";

function initializeReactGA() {
  ReactGA.initialize("UA-140777720-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App() {
  useEffect(() => {
    initializeReactGA();
  }, []);

  return (
    <Switch>
      <Route path="/Old" component={Old} />
      <Route path="/" component={Main} />
    </Switch>
  );
}

export default App;
