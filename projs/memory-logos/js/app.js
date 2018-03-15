// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 12;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');

var gNumNameMap = {
    1: 'Node.JS',
    2: 'Firefox',
    3: 'Opera',
    4: 'Webpack',
    5: 'Angular',
    6: 'React Native',
    7: 'Vue.JS',
    8: 'Java',
    9: 'MongoDB',
    10: 'npm',
    11: 'Safari',
    12: 'VS code'
}

var gCards = getNumsForCards();
render(gCards);

function render(cards) {
    var strHtmls = cards.map(function (card) {
        return `
    <div class="card-wrapper">
        <div class="card" data-card="${card}" onclick="cardClicked(this)">
           <img  src="img/cards/back.png" >
           <img class="back" src="img/cards/${card}.png" >
           <div class="card-text">${gNumNameMap[card]}</div>
        </div>
    </div>        
        `
    })
    document.querySelector('.board').innerHTML = strHtmls.join('\n')
}





// This function is called whenever the user click a card
function cardClicked(elCard) {

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
            }, 1000)

        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                audioWin.play();
            }

        }

    }


}

function getNumsForCards() {
    return [...Array(TOTAL_COUPLES_COUNT).keys()]
                .map(i => i + 1)
                .concat([...Array(TOTAL_COUPLES_COUNT).keys()]
                .map(i => i + 1))
    
}

