const { createApp } = Vue;
let counter = 0;
let winner = "";

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
  methods: {
    click(v) {
      // translating event number to (row,col) form
      let row = Math.ceil(v / 3) - 1;
      let col = 2 - (3 * Math.ceil(v / 3) - v);

      if (this.gameState[row][col] === "") {
        this.gameState[row][col] = this.turn;
        this.turn === "x" ? (this.turn = "o") : (this.turn = "x");
      } else {
        return;
      }
      if (checkWin(this.gameState)) {
        this.gameOver();
      } else if (counter === 9) {
        this.gameOver();
      }
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

/**
check if all elements of an array are equal (to find if some line win)
 */
const allEqual = (arr, callback) => {};

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
