const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const uuid = require("uuid");
const checkWin = require("./public/Js/checkWin");
const router = express.Router();
const faker = require("@faker-js/faker");

class Player {
  constructor(socket) {
    this.socket = socket;
    this.side;
  }
}

class Game {
  constructor(players) {
    this.id = uuid.v4();
    this.grid = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.players = players;
    this.turn = "x";
    this.counter = 0;
    this.winner = "";
  }

  delPlayers() {
    delete this.player1;
    delete this.player2;
  }
}

let playersInQueue = [];
let games = [];

function getGame(socket) {
  const gameIndex = games.findIndex((game) =>
    game.players.some((player) => player.socket === socket)
  );
  return gameIndex;
}

app.set("view engine", "ejs");
app.set("views", "templates");

app.use(router);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("game");
});

let hubSocket = io.of("/socket").on("connection", (socket) => {
  console.log("connection");
  socket.on("join game", () => {
    let exists = false;
    // check if id is credible
    playersInQueue.forEach((player) => {
      if (player === socket) {
        console.log("exists");
        exists = true;
      }
    });

    if (!exists) {
      playersInQueue.push(socket);
      socket.emit("find players");
    }
  });

  socket.on("match players", () => {
    let currentPlayer = playersInQueue.filter((item) => item === socket)[0];
    let otherPlayers = playersInQueue.filter((item) => item !== currentPlayer);

    if (otherPlayers.length > 0) {
      console.log(
        "someone is also looking for players. matching with a random opponent"
      );
      // find random player from list of available players
      let selectedPlayer =
        otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

      // delete two players from queue because they no longer are
      playersInQueue.splice(playersInQueue.indexOf(currentPlayer), 1);
      playersInQueue.splice(playersInQueue.indexOf(selectedPlayer), 1);

      // assingning players random sides
      let playersClass = [
        new Player(selectedPlayer),
        new Player(currentPlayer),
      ];
      playersClass[0].side = ["x", "o"][Math.floor(Math.random() * 2)];
      playersClass[1].side = playersClass[0].side === "o" ? "x" : "o";

      console.log(
        "give players random sides",
        playersClass[0].side,
        playersClass[1].side
      );
      // creating game object
      var game = new Game(playersClass);
      games.push(game);

      // joining players to the same room
      playersClass[0].socket.join(game.id);
      playersClass[1].socket.join(game.id);

      console.log("players joined");

      const gameName = faker.faker.animal.cat();
      // notify players that game found
      game.players.forEach((player) => {
        console.log("sockets ", player.socket.id);
        player.socket.emit("game found", player.side, gameName);
      });

      // starting the game by sending an update to players in the room
      hubSocket
        .to(game.id)
        .emit("update game", { grid: game.grid, turn: game.turn });
    } else {
      console.log("no players found for you :(");
      // send message that no one is looking for game
    }
  });

  socket.on("update value", (row,col) => {
    const game = games[getGame(socket)];
    if (game) {
 
      const player = game.players.filter(
        (player) => player.socket === socket
      )[0];
      console.log("playing", player.side, game.turn);

      // if the selcted square was empty and it was player's turn
      if (game.grid[row][col] === "" && player.side === game.turn) {
        // set the square
        game.grid[row][col] = player.side;
        // change the turn
        game.turn === "x" ? (game.turn = "o") : (game.turn = "x");
        // broadcast changes
        hubSocket
          .to(game.id)
          .emit("update game", { grid: game.grid, turn: game.turn });
      } else {
        console.log("already placed X or O");
        return;
      }
      // if someone won or no one won terminate the game
      if (checkWin(game) || game.counter === 9) {
        console.log("game terminated");
        game.turn = "x";
        game.winner = "";
        game.counter = 0;
        game.grid = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ];
        console.log(game.grid);
        hubSocket.to(game.id).emit("update game", {
          grid: game.grid,
          turn: game.turn,
          counter: game.counter,
        });
      }
    } else if (!game) {
      socket.emit("play offline");
    }
  });

  socket.on("disconnect", () => {
    // remove the player from queue
    playersInQueue = playersInQueue.filter((item) => item.socket !== socket);

    // remove the game
    const gameIndex = getGame(socket);
    if (gameIndex !== -1) games.splice(gameIndex, 1);

    // send termination message to the game room players

    console.log(games);

    console.log(playersInQueue.length);
    console.log("user disconnected");
  });
});

http.listen(5500, () => {
  console.log("listening on http://localhost:5500");
});
