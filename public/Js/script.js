const { createApp } = Vue;


var socket = io("/socket");

createApp({
  data() {
    return {
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
      console.log("Connected to server");
    });
    socket.on("disconnect", function () {
      console.log("Disconnected from server");
    });
    socket.on("update game", (data) => {
      console.log(data.gameState);
      data.gameState.forEach((row, i) => {
        row.forEach((col, j) => {
          this.gameState[i][j] = data.gameState[i][j];
        });
      });
      this.turn = data.turn;
    });
  },
  methods: {
    click(v) {
      socket.emit("update value", v);
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
