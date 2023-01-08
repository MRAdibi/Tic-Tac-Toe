const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let gameState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let turn = "x";
let counter = 0;
let winner = "";

function checkWin(grid) {
  let array = [[], []];

  for (let i = 0; i < grid.length; i++) {
    //diagonals
    array[0].push(grid[i][i]);
    array[1].push(grid[i][2 - i]);

    // rows
    array.push(grid[i]);

    //columns
    array.push(grid.map((x) => x[i]));
  }

  for (let element of array) {
    if (element.every((v) => v === "x")) {
      console.log("X won");
      winner = "x";
      break;
    } else if (element.every((v) => v === "o")) {
      console.log("O won");
      winner = "o";
      break;
    }
  }

  if (winner) {
    return true;
  } else {
    console.log("no won");
    counter++;
    return false;
  }
}

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var nsp = io.of("/socket").on("connection", (socket) => {
  socket.emit("update game", { gameState, turn });
  socket.on("update value", (v) => {
    console.log(v);
    // translating event number to (row,col) form
    let row = Math.ceil(v / 3) - 1;
    let col = 2 - (3 * Math.ceil(v / 3) - v);

    if (gameState[row][col] === "") {
      console.log("s");
      gameState[row][col] = turn;
      turn === "x" ? (turn = "o") : (turn = "x");
      console.log(gameState);
      nsp.emit("update game", { gameState, turn });
    } else {
      console.log("already placed X or O");
    }

    if (checkWin(gameState) || counter === 9) {
      turn = "x";
      winner = "";
      counter = 0;
      gameState = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  });

  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(5500, () => {
  console.log("listening on *:5500");
});
