import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, useEffect, Component} from "react";
// import canvas from "./controllers/canvas";
import Canvas from "react-responsive-canvas";

class App extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.draw();
  }

  draw() {
    // Draw whatever
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render () {
    return (
      <div>
        <Canvas
          canvasRef={el => (this.canvas = el)}
          onResize={this.draw} />
      </div>
    );
  }
}

export default App;
