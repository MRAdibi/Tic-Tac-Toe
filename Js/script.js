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
        this.gameOver(winner);
      } else if (counter === 9) {
        this.gameOver(winner);
      }
    },
    gameOver() {
      // reset states
      this.turn = "x";
      winner = "";
      this.gameState = this.gameState.map((row) => row.map(() => ""));
    },
  },
}).mount("#app");

/**
check if all elements of an array are equal (to find if some line win)
 */
const allEqual = (arr, callback) => {
  arr.forEach((element) => {
    if (element.every((v) => v === "x")) {
      console.log("X won");
      callback(true, "x");
      return;
    } else if (element.every((v) => v === "o")) {
      console.log("O won");

      callback(true, "o");
      return;
    }
  });

  return [false, ""];
};

function checkWin(grid) {
  // check diagnol
  let diags = [[], []];
  for (let i = 0; i < grid.length; i++) {
    diags[0].push(grid[i][i]);
    diags[1].push(grid[i][2 - i]);
  }
  allEqual([diags[0], diags[1]], (val, side) => {
    if (val) {
      winner = side;
    }
  });

  // check cols
  const arrayColumn = (arr, n) => arr.map((x) => x[n]);
  for (let i = 0; i < grid.length; i++) {
    allEqual([arrayColumn(grid, i)], (val, side) => {
      if (val) {
        winner = side;
      }
    });
  }

  // check rows
  for (let i = 0; i < grid.length; i++) {
    allEqual([grid[i]], (val, side) => {
      if (val) {
        winner = side;
      }
    });
  }

  if (winner) {
    return true;
  }
  console.log("no won");
  counter++;
  return false;
}
