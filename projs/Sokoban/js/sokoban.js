'use strict';

/* TODO:
* V build game board manually with walls, boxes and player.
* V convert to objects.
* V render to HTML.
*
* RULES:
* V make player move.
* V make player not walk through objects.
* V make player push boxes.
* V count boxes on targets.
* V win game when all boxes are on targets.
* V count moves during game.
* V create score count

* BONUSES:
* V use arrow keys
* add power-ups
* add obstecles
*/

console.log('Sokoban');

var gBoard;
var gameBoard;
var gPlayerPos;
var gDirection;
var gStats = {
    boxes: 0,
    moves: 0,
    score: 150
}

// tile codes
var w = 'wall';
var b = 'box';
var t = 'target';
var p = 'player';
var f = 'floor';
var e = 'empty'

var board1 = [
    [w, w, w, w, w, w, w, w],
    [w, t, f, f, f, f, t, w],
    [w, f, b, p, f, b, f, w],
    [w, f, f, w, w, f, f, w],
    [w, f, f, w, w, f, f, w],
    [w, f, b, f, f, b, f, w],
    [w, t, f, f, f, f, t, w],
    [w, w, w, w, w, w, w, w],
]
var board2 = [
    [w, w, w, w, w, e, e, e, e],
    [w, f, f, f, w, e, e, e, e],
    [w, f, b, f, w, e, w, w, w],
    [w, f, b, f, w, e, w, t, w],
    [w, w, w, f, w, w, w, t, w],
    [e, w, w, f, p, f, f, t, w],
    [e, w, f, b, f, w, f, f, w],
    [e, w, f, f, f, w, w, w, w],
    [e, w, w, w, w, w, e, e, e],
]
var board3 = [
    [e, e, w, w, w, w, w, e],
    [w, w, w, f, f, f, w, e],
    [w, t, f, f, f, f, w, e],
    [w, w, w, f, p, b, w, e],
    [w, t, w, w, b, f, w, e],
    [w, f, w, f, t, f, w, w],
    [w, b, f, b, f, f, t, w],
    [w, f, f, f, f, f, f, w],
    [w, w, w, w, w, w, w, w],
]
console.table(board2);

function resetGame(board) {
    gStats.boxes = 0;
    gStats.moves = 0;
    gStats.score = 150;
    
    gameBoard = board;
    gBoard = convertBoardToObjs(board);
    renderGameBoard(gBoard);


    var elMoves = document.querySelector('.moves')
    elMoves.innerHTML = 0;
    var elScore = document.querySelector('.score')
    elScore.innerHTML = 150;
    var elGameOver = document.querySelector('.game-over');
    elGameOver.innerHTML = '';
}

function convertBoardToObjs(board) {
    var gBoard = [];
    for (var i = 0; i < board.length; i++) {
        var row = gBoard[i] = []
        for (var j = 0; j < board[0].length; j++) {
            gBoard[i][j] = {
                value: board[i][j],
            };
            if (gBoard[i][j].value === b) gStats.boxes++;
            if (gBoard[i][j].value === p) {
                gPlayerPos = [i, j];
            }
        }
    }
    return gBoard;
}

function renderGameBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td class="' + board[i][j].value + '" id="' + tdId + '"' +
                ' onclick="cellClicked(this, ' + i + ',' + j + ')"></td>';
        }
        strHtml += '</tr>\n';
    }
    elBoard.innerHTML = strHtml;
}

document.onkeydown = function (evt) {
    if (checkGameOver()) return;
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 38: // up
            var neighbor = [-1,0]
            break;
        case 40: // down
            var neighbor = [1,0]
            break;
        case 37: //left
            var neighbor = [0,-1]
            break;
        case 39: // right
            var neighbor = [0,1]
            break;
        default: 
            return;
    }
    var cellI = gPlayerPos[0]+neighbor[0];
    var cellJ = gPlayerPos[1]+neighbor[1];
    var elCell = document.querySelector('#cell-'+cellI+'-'+cellJ);
    if (!elCell) return;
    cellClicked(elCell, cellI, cellJ)
};

function cellClicked(elCell, cellI, cellJ) {
    var cellValue = gBoard[cellI][cellJ].value;
    if (!isAdjacent(cellI, cellJ) || cellValue === w) return;
    if (cellValue === f || cellValue === t) moveToFloor(elCell, cellI, cellJ);
    if (cellValue === b) {
        // cancels move if box cannot move
        if (!moveToBox(elCell, cellI, cellJ)) return  
    }
    var elScore = document.querySelector('.score')
    if (gStats.score > 0) elScore.innerHTML = --gStats.score;
    var elMoves = document.querySelector('.moves')
    elMoves.innerHTML = ++gStats.moves;

    if (checkGameOver()) gameOver()
}

// checks if selected tile is adjacent and finds movement direction
function isAdjacent(cellI, cellJ) {
    // debugger;
    var isCellAdjacent = false;
    if (cellI === gPlayerPos[0]) {
        if (cellJ === gPlayerPos[1] + 1) {
            gDirection = 'right';
            isCellAdjacent = true;
        } else if (cellJ === gPlayerPos[1] - 1) {
            gDirection = 'left';
            isCellAdjacent = true;
        }
    }
    if (cellJ === gPlayerPos[1]) {
        if (cellI === gPlayerPos[0] + 1) {
            gDirection = 'down';
            isCellAdjacent = true;
        } else if (cellI === gPlayerPos[0] - 1) {
            gDirection = 'up';
            isCellAdjacent = true;
        }
    }
    return isCellAdjacent;
}

function moveToFloor(elCell, cellI, cellJ) {
    gBoard[gPlayerPos[0]][gPlayerPos[1]].value = f;
    gBoard[cellI][cellJ].value = p;
    gPlayerPos = [cellI, cellJ];
    var elPlayer = document.querySelector('.player');
    swapClasses(elPlayer, 'floor', 'player');
    swapClasses(elCell, 'player', 'floor');
}

function moveToBox(elCell, cellI, cellJ) {
    var elCell2;
    var cell2I;
    var cell2J;
    // 2nd cell position:
    if (gDirection === 'left') {
        cell2I = cellI;
        cell2J = cellJ - 1;
    } else if (gDirection === 'right') {
        cell2I = cellI;
        cell2J = cellJ + 1;
    } else if (gDirection === 'up') {
        cell2I = cellI - 1;
        cell2J = cellJ;
    } else if (gDirection === 'down') {
        cell2I = cellI + 1;
        cell2J = cellJ;
    }
    elCell2 = document.querySelector('#cell-' + cell2I + '-' + cell2J);

    var cellValue = gBoard[cell2I][cell2J].value
    if (cellValue === w || cellValue === b) return false;
    // set new values
    gBoard[gPlayerPos[0]][gPlayerPos[1]].value = f;
    cellValue = p;
    gBoard[cell2I][cell2J].value = b;
    gPlayerPos = [cellI, cellJ];
    var elPlayer = document.querySelector('.player');
    swapClasses(elPlayer, 'floor', 'player');
    swapClasses(elCell, 'player', 'box');
    swapClasses(elCell2, 'box', 'floor');
    return true;
}

function swapClasses(element, toAdd, toRemove) {
    element.classList.add(toAdd);
    element.classList.remove(toRemove);
}

function checkGameOver() {
    var isGameOver = false;
    var hitTargets = document.querySelectorAll('.target.box');
    if (hitTargets.length === gStats.boxes) isGameOver = true;
    return isGameOver;
}

function gameOver() {
    var elGameOver = document.querySelector('.game-over');
    elGameOver.innerHTML = 'Game over. You win!';
    disableAllCells()
}

function disableAllCells() {
    var allCells = document.querySelectorAll('td');
    for (var i = 0; i < allCells.length; i++) {
        var cell = allCells[i];
        cell.removeAttribute('onclick');
    }
}

// function canMovePlayer(cellI, cellJ) {
//     if (isAdjacent(cellI, cellJ) && !isWall(cellI, cellJ)) {
//         return true
//     }
//     return false;
// }

// function isWall(cellI, cellJ) {
//     var cellIsWall = false;
//     if (gBoard[cellI][cellJ].value === w) cellIsWall = true;
//     return cellIsWall;
// }
// var test1 = isAdjacent(0,0)
// var test2 = isAdjacent(1,4)
// var test3 = isAdjacent(2,4)
// var test4 = isAdjacent(2,5)
// var test4 = isAdjacent(1,3)
// console.log('Checking tile 0,0. expecting: false. result:', isAdjacent(0,0));
// console.log('Checking tile 1,4. expecting: true. result:', isAdjacent(1,4));
// console.log('Checking tile 2,4. expecting: false. result:', isAdjacent(2,4));
// console.log('Checking tile 2,5. expecting: true. result:', isAdjacent(2,5));
// console.log('Checking tile 1,3. expecting: false. result:', isAdjacent(1,3));

