'use strict';
var NOTES;

var gState;

function init() {
    gState = {
        isUserTurn : false,
        seqNoteIndexes: [],
        currNoteIndexToClick: 0,
        highScore: getFromStorage('highScore') || '0',
    }
    var elHighscore = document.querySelector('.highscore');
    elHighscore.innerHTML = gState.highScore;
    NOTES = createNotes(4);
    renderNotes(NOTES);
    doComputerMove(); 
}

function doComputerMove() {
    var elNotes = document.querySelectorAll('.note');
    elNotes.forEach(function (elNote) {
        elNote.classList.add('wait');
    })
    tellUser('Computer Move...');
    addRandomNote();
    playSeq();
}

// Create the Notes model
function createNotes(size){
    var notes = [];
    
    for (var i = 0; i < size; i++) {
       var audioFileName = 'sound/Note' + (i+1) + '.mp3'; 
       var note = {sound : new Audio(audioFileName), color: getRandomColor()};
       notes.push(note);
    }
    return notes;
}

function renderNotes(notes) {
    // mapping notes to html tags
    var strHtmls = notes.map(function(note, i){
        var strHtml =  `
        <div class="note note${i+1}" onclick="noteClicked(this, ${i})"></div>
        `;
        return strHtml;
    });
    var elPiano = document.querySelector('.piano');
    elPiano.innerHTML = strHtmls.join('');
    
    //add center brick
    elPiano.innerHTML += '<div class="center"><span class="userMsg"></span></div>'
}

function addRandomNote() {
    var randNoteIndex = getRandomIntInclusive(0, NOTES.length-1);
    gState.seqNoteIndexes.push(randNoteIndex);
}

function playSeq() {
    var elNotes = document.querySelectorAll('.note');

    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {
        setTimeout(function playNote() {
            elNotes[seqNoteIndex].classList.add('playing');
            NOTES[seqNoteIndex].sound.play();
            
            setTimeout(function () {
                elNotes[seqNoteIndex].classList.remove('playing');
            }, 500);
            
            console.log('Playing: ', NOTES[seqNoteIndex].sound);
        }, 1000 * i);
    });
    
    // When done playing the seq - change turns
    setTimeout(function () {
        console.log('Done Playing!!');
        gState.isUserTurn = true;
        tellUser('Your move!');
        
        elNotes.forEach(function (elNote) {
            elNote.classList.remove('wait');
        })
    }, 1000 * gState.seqNoteIndexes.length + 1000); 

}

function noteClicked(elNote, noteIndex) {
    
    if (!gState.isUserTurn) return;
    elNote.classList.add('clicked');
    NOTES[noteIndex].sound.play()
    setTimeout(function(){
        elNote.classList.remove('clicked');
    }, 500);
    
    // User clicked the right note?
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        console.log('User OK!');
        gState.currNoteIndexToClick++;
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            console.log('User done playing seq!');
            tellUser('Good one!', 1000);
            gState.isUserTurn = false;
            gState.currNoteIndexToClick = 0;
            setTimeout(doComputerMove, 2000);
        }
    } else {
        gState.isUserTurn = false;
        tellUser('You were wrong. GAME OVER', 1500);
        setTimeout(() => {
            tellUser('Starting new game', 1500)
        }, 1500);
        checkHighscore();
        setTimeout(init, 3000);
    }
    console.log('Note', NOTES[noteIndex]);
}

function tellUser(msg, dismissAfter) {
    var elUserMsg = document.querySelector('.userMsg');
    elUserMsg.innerHTML = msg;
    if (dismissAfter) {
        setTimeout(function(){
            elUserMsg.innerHTML = '';
        }, dismissAfter);
    }
}

function checkHighscore() {
    var level = gState.seqNoteIndexes.length;
    var highscore = gState.highScore;
    var elWow = document.querySelector('.wow');
    if (!highscore) {
        alert('New high score! You reached level ' + level);
        saveToStorage('highScore',level);
        highscore = level;
        // show(elWow);
    } else if (level > getFromStorage('highScore')) {
        alert('New high score! You reached level ' + level);
        saveToStorage('highScore',level);
        highscore = level;
        // show(elWow);
    }
    console.log('Highscore:' + getFromStorage('highScore'));   
}

function hide(el) {
    el.classList.add('hidden');
}
function show(el) {
    el.classList.remove('hidden');
}