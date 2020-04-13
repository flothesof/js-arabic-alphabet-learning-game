const LETTER_MAPPING = { 'a': 'ا', 'ou': 'و', 'i': 'ي' }

const LEVEL_LETTERS = { 1: ['a', 'ou', 'i'] }

function randInt(N) {
    // returns integer between O and N-1
    return Math.floor(Math.random() * N);
}

function runlevel(level) {
    letters = LEVEL_LETTERS[level]
    document.getElementById('game-area').hidden = false;
    document.getElementById('game-area').current_level = level

    button_area = document.getElementById('button-area');
    // clearing old children
    while (button_area.firstChild) {
        button_area.removeChild(button_area.firstChild);
    }
    // adding a button for each letter in the current level
    for (let i = 0; i < letters.length; i++) {
        button = document.createElement('button');
        button.innerHTML = letters[i];
        button_area.appendChild(button);
        button.addEventListener("click", checkAnswer);
    }
    // generating a new quizz question
    generateNewQuestion();
}

function generateNewQuestion() {
    // sets up a new question
    level = document.getElementById('game-area').current_level;
    letters = LEVEL_LETTERS[level];
    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        previousValue = document.getElementById('game-area').answer;
        possibleLetters = letters.filter(function(value, index, arr) { return value != previousValue; });
        randomAnswer = possibleLetters[randInt(possibleLetters.length)];
        randomLetter = LETTER_MAPPING[randomAnswer];
    } else {
        // generate any new random letter
        randomAnswer = letters[randInt(letters.length)];
        randomLetter = LETTER_MAPPING[randomAnswer];

    }
    var c = document.getElementById("myCanvas");
    var cArabic = c.getContext("2d");
    cArabic.clearRect(0, 0, c.width, c.height);
    cArabic.font = "400px Arial";
    cArabic.textAlign = 'center';
    cArabic.fillText(randomLetter, c.width / 2., c.height * 3 / 4.);
    document.getElementById('game-area').answer = randomAnswer;
}

function checkAnswer(e) {
    var caller = e.target || e.srcElement;
    if (document.getElementById('game-area').answer == caller.innerHTML) {
        document.getElementById('progress-bar').innerHTML += '+';
    } else {
        document.getElementById('progress-bar').innerHTML += '-';
    }
    generateNewQuestion();
}



function hideGameArea() {
    document.getElementById('game-area').hidden = true;
}