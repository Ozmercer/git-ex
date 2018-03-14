function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function shuffle(a) {
  var j, temp, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = a[i];
      a[i] = a[j];
      a[j] = temp;
  }
}

function countNeighbors(board, cellRowIdx, cellColIdx) {
  var count = 0;
  for (var i = cellRowIdx-1; i <= cellRowIdx+1; i++) {
      if (i < 0 || i >= board.length) continue;                //board edge
      for (var j = cellColIdx-1; j <= cellColIdx+1; j++) {
          if (i === cellRowIdx && j === cellColIdx) continue;  // center cell
          if (j < 0 || j >= board.length) continue;            //board edge
          if (board[i][j]) count++;
      }
  }
  return count;
}