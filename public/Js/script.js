const { createApp } = Vue;
var socket = io("/socket");
// notification box selected
const notificationBox = document.querySelector(".notification");

const notify = (message, type) => {
  notificationBox.querySelector('p').innerHTML = message;
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

createApp({
  data() {
    return {
      notificationMessage: "",
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

    socket.on("game found", (playerside) => {
      console.log("game found");

      notify("You are connected to the game!!!! Enjoy...");

      this.side = playerside;
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
      socket.emit("update value", v);
    },
    startOnline() {
      socket.emit("join game", localStorage.getItem("id"));
    },
    startOffline() {},
    gameOver() {
      // reset states
      this.turn = "x";
      winner = "";
      counter = 0;
      this.gameState = this.gameState.map((row) => row.map(() => ""));
    },
  },
}).mount("#app");
