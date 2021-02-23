import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, useEffect, Component } from "react";
import Canvas from "react-responsive-canvas";
import { Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import Home from "./screens/Home";

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
      <Route path="/" component={Home} />
    </Switch>
  );
}

export default App;
