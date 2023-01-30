const { createApp } = Vue;
var socket = io("/socket");
// notification box selected
const notificationBox = document.querySelector('.notification');

createApp({
  data() {
    return {
      game: "",
      turn: "x",
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
      alert("play offline")
    })
    socket.on("find players", function () {
      //register to server to find game
      socket.emit("match players");
    });

    socket.on("game found", (gameId) => {
      console.log("game found", gameId)
      // notification alert here 
      // add a event to close the notification box
      notificationBox.classList.add('notif-active')
      document.querySelector('.btn-close').addEventListener('click', () => {
        notificationBox.classList.remove('notif-active')
      })
      // this time out is to remove the notification automatically
      setTimeout(() => {
        notificationBox.classList.remove("notif-active")
      }, 5000)

      this.game = gameId
    })

    socket.on("update game", (data) => {
      console.log(data)
      // set the grid and turn to updated values
      data.grid.forEach((row, i) => {
        row.forEach((col, j) => {
          this.gameState[i][j] = data.grid[i][j];
        });
      });
      this.turn = data.turn;
      this.counter = data.counter
    });
  },
  methods: {
    click(v) {
      socket.emit("update value", v);
    },
    startOnline() {
      socket.emit("join game", localStorage.getItem("id"));
    },
    startOffline() { },
    gameOver() {
      // reset states
      this.turn = "x";
      winner = "";
      counter = 0;
      this.gameState = this.gameState.map((row) => row.map(() => ""));
    },
  },
}).mount("#app");
