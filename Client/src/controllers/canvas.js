export default class Canvas {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;
    this.ctx = canvasElement.getContext("2d");
  }
  createCircle() {
    // we create a random value to place the circles
    // in random locations
    const x = Math.floor(Math.random() * 450);
    const y = Math.floor(Math.random() * 450);
    this.ctx.beginPath();
    this.ctx.arc(x, y, 50, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}
