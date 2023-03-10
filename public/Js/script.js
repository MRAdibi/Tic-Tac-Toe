const { createApp } = Vue;
var socket = io("/socket");

const notify = (message, type) => {
  // notification box selected
  const notificationBox = document.querySelector(".notification");

  notificationBox.querySelector("p").innerHTML = message;
  // In this part, we need to get our alert type and send the appropriate class of that alert to the document
  notificationBox.classList.add("notif-active");
  // notification alert here
  // add a event to close the notification box
  document.querySelector(".btn-close").addEventListener("click", () => {
    notificationBox.classList.remove("notif-active");
  });

  // this time out is to remove the notification automatically
  setTimeout(() => {
    notificationBox.classList.remove("notif-active");
  }, 5000);
};
Promise

createApp({
  data() {
    return {
      online: false,
      gameName: "",
      turn: "x",
      side: "",
      message: "Tic Tac Toe!",
      gameState: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
    };
  },
  created() {
    // socket connections
    socket.on("connect", function () {
      //socket.emit("update value");

      console.log("Connected to server");
    });
    socket.on("disconnect", function () {
      console.log("Disconnected from server");
    });

    socket.on("play offline", () => {
      alert("play offline");
    });
    socket.on("find players", function () {
      //register to server to find game
      socket.emit("match players");
    });

    socket.on("game found", (playerside, gamename) => {
      console.log("game found");
      console.log(gamename);

      notify("You are connected to the game!!!! Enjoy...");
      this.side = playerside;
      this.gameName = gamename;
    });

    socket.on("update game", (data) => {
      console.log(data);
      // set the grid and turn to updated values
      data.grid.forEach((row, i) => {
        row.forEach((col, j) => {
          this.gameState[i][j] = data.grid[i][j];
        });
      });
      this.turn = data.turn;
      this.counter = data.counter;
    });

    socket.on("game ended", (reason) => {});
  },
  methods: {
    click(v) {
      let row = Math.ceil(v / 3) - 1;
      let col = 2 - (3 * Math.ceil(v / 3) - v);

      if (this.online) {
        socket.emit("update value", row, col);
      } else {
        // set the square
        this.gameState[row][col] = this.turn;
        // change the turn
        this.turn === "x" ? (this.turn = "o") : (this.turn = "x");
      }
    },
    startOnline() {
      this.online = true;
      socket.emit("join game");
    },
    startOffline() {
      // toggle game form
      this.online === true ? (this.online = false) : (this.online = true);
    },
    gameOver() {
      // reset states
      this.turn = "x";
      winner = "";
      counter = 0;
      this.gameState = this.gameState.map((row) => row.map(() => ""));
    },
  },
}).mount("#app");
