module.exports =  function checkWin(game) {
  let array = [[], []];

  for (let i = 0; i < game.grid.length; i++) {
    //diagonals
    array[0].push(game.grid[i][i]);
    array[1].push(game.grid[i][2 - i]);

    // rows
    array.push(game.grid[i]);

    //columns
    array.push(game.grid.map((x) => x[i]));
  }

  for (let element of array) {
    if (element.every((v) => v === "x")) {
      console.log("X won");
      game.winner = "x";
      break;
    } else if (element.every((v) => v === "o")) {
      console.log("O won");
      game.winner = "o";
      break;
    }
  }

  if (game.winner) {
    return true;
  } else {
    console.log("no won");
    game.counter++;
    return false;
  }
}
