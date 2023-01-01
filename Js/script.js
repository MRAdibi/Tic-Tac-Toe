const { createApp } = Vue;
let state = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

createApp({
  data() {
    return {
      turn: "X",
      message: "Hello Vue!",
      gameState: state,
    };
  },
  methods: {
    click(v) {
      // translating event number to (row,col) form
      let row = Math.ceil(v / 3) - 1;
      let col = 2 - (3 * Math.ceil(v / 3) - v);

      if (this.gameState[row][col] === "") {
        this.gameState[row][col] = this.turn;
        this.turn === "X" ? (this.turn = "O") : (this.turn = "X");
      }
      if (checkWin(this.gameState)) {
        console.log("a");
        this.gameState = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ];
      }
    },
  },
}).mount("#app");

// check if all elements of an array are equal (to find if someone win)
const allEqual = (arr) =>
  arr.every((v) => v === arr[0] && (v === "X" || v == "O"));

function checkWin(grid) {
  // check diagnol
  let diags = [[], []];
  for (let i = 0; i < grid.length; i++) {
    diags[0].push(grid[i][i]);
    diags[1].push(grid[i][2 - i]);
  }
  if (allEqual(diags[0]) || allEqual(diags[1])) {
    console.log("diagnols won");
    return true;
  }

  // check cols
  const arrayColumn = (arr, n) => arr.map((x) => x[n]);
  for (let i = 0; i < grid.length; i++) {
    if (allEqual(arrayColumn(grid, i))) {
      console.log("cols won");

      return true;
    }
  }

  // check rows
  for (let i = 0; i < grid.length; i++) {
    if (allEqual(grid[i])) {
      console.log("rows won");
      return true;
    }
  }
  console.log("no won");
  return false;
}
