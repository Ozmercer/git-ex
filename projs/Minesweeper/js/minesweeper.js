'use strict';

/* TODO:
* V build game matrix (4X4).
* V fill board with mines (2).
* V fill numbers next to mines.
* V render board.
* V cover board mith buttons.
* V uncover buttons when clicked .
* V and flag with rightClick and lock button. Remove flag with rightClick.
* V end game when hit mine.
* V reveal neighbors when cell is empty.
* V add reset button.
* V add difficulties.

** V endgame()
** V expandShown()
*/

console.log('MineSweeper');

var BOARD_DIMENTION = 4;
var MINE_COUNT = 2;

var gState;
var gBoard;
var gTime = 0;
var gGameInterval;
var mineSym = '💣';

function resetGame(level) {
    if (level === 'easy') {
        BOARD_DIMENTION = 4;
        MINE_COUNT = 2;
    } else if (level === 'medium') {
        BOARD_DIMENTION = 6;
        MINE_COUNT = 5;
    } else if (level === 'hard') {
        BOARD_DIMENTION = 8;
        MINE_COUNT = 15;
    }

    gState = {
        isGameOn: true,
        shownCount: 0,
        flagCount: 0,
        mineCount: MINE_COUNT,
    };
    clearInterval(gGameInterval);
    gTime = 0;
    initBoard();

    var elSmiley = document.querySelector('.smiley');
    elSmiley.classList.remove('loose');
    elSmiley.innerHTML = '☻';

    var elGameOver = document.querySelector('.game-over');
    elGameOver.innerHTML = ''

    var elTimer = document.querySelector('.timer');
    elTimer.innerHTML = '';
    updateStats()
}

function initBoard() {
    gBoard = createGameBoard();
    renderGameBoard(gBoard);
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = document.querySelector('#cell-'+i+'-'+j)
            if (gBoard[i][j].value !== mineSym) elCell.classList.add('num'+gBoard[i][j].value)
        }
    }
}

function createGameBoard() {
    var board = createEmptyBoard();
    board = addNumsToBoard(board);
    return board;
}

function renderGameBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td class="gray" id="'+tdId+'" onclick="cellClicked(this, '+i+','+j+')"' +
                ' oncontextmenu="flagCell(this,'+i+','+j+'); return false;"><span class="cover">'
            strHtml += board[i][j].value;
            strHtml += '</span></td>'
        }
        strHtml += '</tr>\n';
    }
    elBoard.innerHTML = strHtml;
}

function createEmptyBoard() {
    var board = [];
    var mineArr = getMineInArr();
    for (var i = 0; i < BOARD_DIMENTION; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_DIMENTION; j++) {
            board[i][j] = {
                value: mineArr.pop(),
                cover: true,
                flag: false,
            }
        }
    }
    return board
}

function getMineInArr() {
    var mineArr = [];
    for (var i = 0; i < BOARD_DIMENTION ** 2; i++) {
        mineArr.push('')
    }
    for (var i = 0; i < MINE_COUNT; i++) {
        mineArr[i] = mineSym;
    }
    shuffle(mineArr);
    return mineArr;
}

function addNumsToBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].value !== mineSym) {
                board[i][j].value = (countMineNegs(board, i, j) === 0) ? '' :
                    countMineNegs(board, i, j);
            }
        }
    }
    return board;
}

function countMineNegs(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;        //board edge
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;  // center cell
            if (j < 0 || j >= board.length) continue;    //board edge
            if (board[i][j].value === mineSym) count++;
        }
    }
    return count;
}

function cellClicked(elCell, cellI, cellJ) {
    var cell = gBoard[cellI][cellJ].value;
    uncover(elCell, cellI, cellJ);
    removeOnClick(elCell);
    if (gTime === 0) startTimer();
    if (cell === mineSym) loseGame();
    else if (cell === '') {
        gState.shownCount++;
        expandShown(cellI, cellJ);
    }
    else gState.shownCount++
    if (!checkGameOver()) winGame();
}

function loseGame() {
    gState.isGameOn = false;
    clearInterval(gGameInterval);
    revealAllMines();
    disableAllCells();
    var elSmiley = document.querySelector('.smiley');
    elSmiley.classList.add('loose');
    elSmiley.innerHTML = '☠';
    var elGameOver = document.querySelector('.game-over');
    elGameOver.innerHTML = 'GAME OVER!\nYOU LOSE'
}

function winGame() {
    gState.isGameOn = false;
    clearInterval(gGameInterval);
    disableAllCells();
    gState.shownCount = BOARD_DIMENTION ** 2;
    gState.mineCount = 0;
    var elGameOver = document.querySelector('.game-over');
    elGameOver.innerHTML = 'GAME OVER!\nYOU WIN!';
    updateStats();
}

function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;      //board edge
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;   //center cell
            if (j < 0 || j >= gBoard.length) continue;  //board edge
            var elCell = document.querySelector('#cell-' + i + '-' + j + '');
            if (gBoard[i][j].cover) {
                uncover(elCell, i, j);
                removeOnClick(elCell);
                if (!gBoard[i][j].value) expandShown(i, j);
                gState.shownCount++
            }
        }
    }
}

function checkGameOver() {
    var gameOn = true;
    if (gState.shownCount === (BOARD_DIMENTION ** 2 - MINE_COUNT)) gameOn = false;
    return gameOn;
}

function uncover(elCell, cellI, cellJ) {
    gBoard[cellI][cellJ].cover = false;
    var elSpan = elCell.querySelector('span');
    elSpan.classList.remove('cover');
    elCell.classList.remove('gray');
    gState.cover--;
    updateStats();
}

function flagCell(elCell, cellI, cellJ) {
    if (gBoard[cellI][cellJ].flag) {
        gBoard[cellI][cellJ].flag = false;
        elCell.classList.remove('flag');
        elCell.setAttribute('onclick', 'cellClicked(this, ' + cellI + ',' + cellJ + ')')
        gState.flagCount--;
        gState.mineCount++
    } else {
        gBoard[cellI][cellJ].flag = true;
        elCell.classList.add('flag');
        removeOnClick(elCell)
        gState.flagCount++;
        gState.mineCount--
    } 
    updateStats();
}

function startTimer() {
    var elTimer = document.querySelector('.timer');
    gGameInterval = setInterval(function () {
        gTime += 0.1;
        elTimer.innerHTML = gTime.toFixed(1);
    }, 100)
}

function removeOnClick(elCell) {
    elCell.removeAttribute('onclick');
}
function disableAllCells() {
    var allCells = document.querySelectorAll('td');
    for (var i = 0; i < allCells.length; i++) {
        var cell = allCells[i];
        removeOnClick(cell);
        cell.removeAttribute('oncontextmenu')
    }
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].value === mineSym) {
                var elMine = document.querySelector('#cell-' + i + '-' + j + '');
                uncover(elMine, i, j);
                elMine.classList.add('bomb')
            }
        }
    }
}

function updateStats() {
    var elFlags = document.querySelector('.flags');
    elFlags.innerHTML = gState.flagCount;

    var elUncovered = document.querySelector('.uncovered');
    elUncovered.innerHTML = gState.shownCount;

    var elMines = document.querySelector('.mine');
    elMines.innerHTML = gState.mineCount;
    
}
// test createGameBoard
// var gameBoard = createGameBoard()
// console.table(gameBoard);

// test createBoard
// console.table(createMineBoard(BOARD_DIMENTION))

// test getMineInArr
// console.log(getMineInArr());

// Unit Test - addNumsToBoard
// var testBoard = [
//     ['💣','','',''],
//     ['','💣','💣',''],
//     ['','','',''],
//     ['💣','💣','',''],
// ]
// console.log('test board:');
// console.table(testBoard);
// var finalBoard = addNumsToBoard(testBoard);
// console.log('final board:');
// console.table(finalBoard);
// renderGameBoard(finalBoard);
