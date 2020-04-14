const LETTER_MAPPING = { 'a': 'ا', 'ou': 'و', 'i': 'ي', 'nou': 'ن', 'ha': 'ه', 'd': 'د', 'r': 'ر', 't': 'ت', 'b': 'ب', 'th': 'ث' }

const LEVEL1 = [
    ['recognition', ['a', 'ou', 'i']],
    ['drawing', ['a', 'ou', 'i']]
]

const LEVEL2 = [
    ['recognition', ['b', 't', 'th']],
    ['drawing', ['b', 't', 'th']],
    ['recognition', ['a', 'ou', 'i', 'b', 't', 'th']],
    ['drawing', ['a', 'ou', 'i', 'b', 't', 'th']]
]

const LEVELS = [LEVEL1, LEVEL2]

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
        button.className = 'quizz-button';
        button_area.appendChild(button);
        button.addEventListener("click", checkAnswer);
    }
    // initializing quizz data
    document.getElementById('game-area').quizzData = { 'total': 32, 'correct': 0, 'incorrect': 0 };
    // generating a new quizz question
    generateNewQuestion();
}

function updateQuizzProgressBar() {
    // updates progress bar
    quizzData = document.getElementById('game-area').quizzData;
    progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = 'Question : ' + (quizzData['correct'] + quizzData['incorrect']) + '/' + quizzData['total'] + ' | Correctes : ' + quizzData['correct'] + '/' + (quizzData['correct'] + quizzData['incorrect']);
}

function generateNewQuestion() {
    // sets up a new question
    level = document.getElementById('game-area').current_level;
    letters = LEVEL_LETTERS[level];
    quizzData = document.getElementById('game-area').quizzData;

    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        previousValue = document.getElementById('game-area').answer;
        possibleLetters = letters.filter(function(value, index, arr) { return value != previousValue; });
        randomAnswer = possibleLetters[randInt(possibleLetters.length)];
        randomLetter = LETTER_MAPPING[randomAnswer];
    } else {
        // generate any new random letter the first time we start the game
        randomAnswer = letters[randInt(letters.length)];
        randomLetter = LETTER_MAPPING[randomAnswer];

    }
    var c = document.getElementById("myCanvas");
    var cArabic = c.getContext("2d");
    cArabic.clearRect(0, 0, c.width, c.height);
    cArabic.font = "400px Arial";
    cArabic.textAlign = 'center';
    cArabic.fillText(randomLetter, c.width / 2., c.height * 4 / 5.);
    document.getElementById('game-area').answer = randomAnswer;

    // update progress bar
    updateQuizzProgressBar();

}

function checkAnswer(e) {
    quizzData = document.getElementById('game-area').quizzData;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total']) {
        var caller = e.target || e.srcElement;
        if (document.getElementById('game-area').answer == caller.innerHTML) {
            document.getElementById('game-area').quizzData['correct'] += 1;
        } else {
            document.getElementById('game-area').quizzData['incorrect'] += 1;
        }
        generateNewQuestion();
    } else {
        updateQuizzProgressBar();
    }
}



function hideGameArea() {
    document.getElementById('game-area').hidden = true;
}

function setupLevels() {
    // parse level descriptions and build nested level layout
    root = document.getElementById('levels-container');
    for (let chapterIndex in LEVELS) {
        levelRoot = document.createElement('details');
        levelSummary = document.createElement('summary');
        levelHeader = document.createElement('em')
        levelHeader.innerHTML = 'Chapitre ' + (parseInt(chapterIndex) + 1);
        levelSummary.appendChild(levelHeader)
        levelRoot.appendChild(levelSummary)
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            items = LEVELS[chapterIndex][exerciseIndex]
            taskType = items[0];
            taskLetters = items[1];
            if (taskType == 'recognition') {
                header = document.createElement('h3')
                header.appendChild(document.createTextNode('Exercice ' + (parseInt(chapterIndex) + 1) + '.' + (parseInt(exerciseIndex) + 1) + ' : ' +
                    ' Reconnaître les lettres ' + taskLetters.join(' - ')))
                levelRoot.appendChild(header)

                linkNode = document.createElement('a')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                linkNode.href = "#game"
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                levelRoot.appendChild(linkNode)

            } else {
                console.log('Could not recognize task type: ' + taskType);
            }

        }
        root.appendChild(levelRoot);

    }
}


function runLevel(chapterIndex, exerciseIndex) {
    console.log(`Running chapter ${chapterIndex} exercise ${exerciseIndex}`)
}