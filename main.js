"use-strict";
import {DrawBoard} from './board.js'
import {App} from './app.js'
const width = 1000;
const height = 900;

const positions = [
  -2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, -5, 5, 0, 0, 0, -3, 0, -5, 0, 0, 0, 0, 2,
];

localStorage.setItem("positions", JSON.stringify(positions));
localStorage.setItem('status', 'ROLLING')
localStorage.setItem('current-player', 'BLACK')

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");

  canvas.style.left = `calc(50% - ${width / 2}px)`;
  canvas.style.top = `calc(50% - ${height / 2}px)`;

  const board = new DrawBoard(canvas, width, height, 20);
  board.draw();
});

const appElement = document.getElementById("app");
const app = new App(appElement, width, height);
app.DrawtRocks();