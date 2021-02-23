import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, useEffect, Component } from "react";
import Canvas from "react-responsive-canvas";
import { Route, Switch } from "react-router-dom";
import ReactGA from "react-ga";
import Home from "./screens/Home";

function initializeReactGA() {
  ReactGA.initialize("G-7Z286BH7JF");
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
