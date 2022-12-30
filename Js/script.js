let grid = [
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 0],
];

const allEqual = (arr) => arr.every((v) => v === arr[0] && (v === 1 || v == 2));

function checkWin() {
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
checkWin(grid);
const event = new Event("grid-update");

// Listen for the event.
elem.addEventListener("grid-update", (e) => {
  console.log("grid updated");
});

// Dispatch the event.
elem.dispatchEvent(event);
