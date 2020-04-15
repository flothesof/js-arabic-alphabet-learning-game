const reverseMapping = o => Object.keys(o).reduce((r, k) =>
    Object.assign(r, {
        [o[k]]: (r[o[k]] || []).concat(k)
    }), {})

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const STAR_MAPPING = {
    5: decodeHtml('&#9733&#9733&#9733&#9733&#9733'),
    4: decodeHtml('&#9733&#9733&#9733&#9733&#9734'),
    3: decodeHtml('&#9733&#9733&#9733&#9734&#9734'),
    2: decodeHtml('&#9733&#9733&#9734&#9734&#9734'),
    1: decodeHtml('&#9733&#9734&#9734&#9734&#9734'),
    0: decodeHtml('&#9734&#9734&#9734&#9734&#9734')
}

const REVERSE_STAR_MAPPING = reverseMapping(STAR_MAPPING);

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

function updateQuizzProgressBar() {
    // updates progress bar
    var quizzData = document.getElementById('game-area').quizzData;
    var progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = 'Question : ' + (quizzData['correct'] + quizzData['incorrect']) + '/' + quizzData['total'] + ' | Correctes : ' + quizzData['correct'] + '/' + (quizzData['correct'] + quizzData['incorrect']);
}

function generateNewRecognitionQuestion() {
    // sets up a new question
    var taskLetters = document.getElementById('game-area').taskLetters

    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        var previousValue = document.getElementById('game-area').answer;
        var possibletaskLetters = taskLetters
            .filter(function(value) { return value != previousValue; });
        randomAnswer = possibletaskLetters[randInt(possibletaskLetters
            .length)];
        randomLetter = LETTER_MAPPING[randomAnswer];
    } else {
        // generate any new random letter the first time we start the game
        var randomAnswer = taskLetters[randInt(taskLetters
            .length)];
        var randomLetter = LETTER_MAPPING[randomAnswer];

    }
    // saving the new answer for later
    document.getElementById('game-area').answer = randomAnswer;

    // drawing the new letter on the canvas
    drawLetterOnCanvas(randomLetter);

    // update progress bar
    updateQuizzProgressBar();

}

function clearCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLetterOnCanvas(randomLetter, clearBeforeDrawing = true) {
    if (clearBeforeDrawing) {
        clearCanvas();
    }
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "280px Amiri";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(randomLetter, canvas.width / 2., canvas.height / 2.);
}

function checkRecognitionAnswer(e) {
    var quizzData = document.getElementById('game-area').quizzData;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total']) {
        var caller = e.target || e.srcElement;
        if (document.getElementById('game-area').answer == caller.innerHTML) {
            document.getElementById('game-area').quizzData['correct'] += 1;
        } else {
            document.getElementById('game-area').quizzData['incorrect'] += 1;
        }
        generateNewRecognitionQuestion();
    } else {
        updateQuizzProgressBar();
        var chapter, exercise, correct, incorrect;
        [chapter, exercise] = document.getElementById('game-area').currentLevel;
        [correct, incorrect] = [quizzData['correct'], quizzData['incorrect']]
        updateStarRating(chapter, exercise, correct, incorrect)
        updateChapterProgress();
    }
}



function hideGameArea() {
    document.getElementById('game-area').hidden = true;
}

// eslint-disable-next-line no-unused-vars
function setupLevels() {
    /**
     * Parse level descriptions and build nested level layout.
     */
    var root = document.getElementById('levels-container');
    for (let chapterIndex in LEVELS) {
        var levelRoot = document.createElement('details');
        var levelSummary = document.createElement('summary');
        var levelHeader = document.createElement('em')
        levelHeader.innerHTML = 'Chapitre ' + (parseInt(chapterIndex) + 1);
        levelHeader.innerHTML += ` <span class="chapter-progress" id="chapter-progress-${chapterIndex}">0%</span>`
        levelSummary.appendChild(levelHeader)
        levelRoot.appendChild(levelSummary)
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            var items = LEVELS[chapterIndex][exerciseIndex]
            var taskType = items[0];
            var tasktaskLetters = items[1];
            if (taskType == 'recognition') {
                var div = document.createElement('div')
                levelRoot.appendChild(div)
                div.className = 'exercise'
                var header = document.createElement('h3')
                header.appendChild(document.createTextNode('Exercice ' + (parseInt(chapterIndex) + 1) + '.' + (parseInt(exerciseIndex) + 1) + ' : ' +
                    ' Reconnaître les lettres ' + tasktaskLetters
                    .join(' - ')))

                div.append(header)
                var linkNode = document.createElement('a')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                linkNode.href = "#game"
                    // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game'
                div.appendChild(linkNode)

                var stars = document.createElement('div')
                stars.innerHTML = 'Score : ' + STAR_MAPPING[0]
                stars.id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`
                div.appendChild(stars)

            } else if (taskType == 'drawing') {
                div = document.createElement('div')
                levelRoot.appendChild(div)
                div.className = 'exercise'
                header = document.createElement('h3')
                header.appendChild(document.createTextNode('Exercice ' + (parseInt(chapterIndex) + 1) + '.' + (parseInt(exerciseIndex) + 1) + ' : ' +
                    ' Dessiner les lettres ' + tasktaskLetters
                    .join(' - ')))

                div.append(header)
                linkNode = document.createElement('a')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                linkNode.href = "#game";
                // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game'
                div.appendChild(linkNode)

                stars = document.createElement('div')
                stars.innerHTML = 'Score : ' + STAR_MAPPING[0]
                stars.id = `score-chapter${chapterIndex}-exercise${exerciseIndex}`
                div.appendChild(stars)
            } else {
                console.log('Could not recognize task type: ' + taskType);
            }

        }
        root.appendChild(levelRoot);

    }
    hideGameArea()
        // eslint-disable-next-line no-undef
    var sketcher = new Sketchable(document.getElementById('myCanvas'));
    sketcher.config({ 'interactive': false });
    // keep reference for later
    document.getElementById('game-area').sketcher = sketcher;

    // disabling swipping / scrolling while drawing
    // https://stackoverflow.com/questions/49047414/disable-scroll-swipe-action-for-html-canvas-drawing-on-ios
    var canvas_dom = document.getElementById('myCanvas')
    canvas_dom.addEventListener("touchstart", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchmove", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchend", function(event) { event.preventDefault() })
    canvas_dom.addEventListener("touchcancel", function(event) { event.preventDefault() })

}


function runLevel(chapterIndex, exerciseIndex) {
    /**
     * Starts a new level defined by chapter and exercise index.
     */

    var exercise = LEVELS[chapterIndex][exerciseIndex]
    var taskType = exercise[0];
    var taskLetters = exercise[1];
    if (taskType == 'recognition') {
        document.getElementById('game-area').hidden = false;
        document.getElementById('game-area').currentLevel = [chapterIndex, exerciseIndex]
        document.getElementById('game-area').taskLetters = taskLetters
        var buttonArea = document.getElementById('button-area');
        // clearing old children
        while (buttonArea.firstChild) {
            buttonArea.removeChild(buttonArea.firstChild);
        }
        // adding a button for each letter in the current level
        for (let i = 0; i < taskLetters
            .length; i++) {
            let button = document.createElement('button');
            button.innerHTML = taskLetters[i];
            button.className = 'quizz-button';
            buttonArea.appendChild(button);
            button.addEventListener("click", checkRecognitionAnswer);
        }
        // initializing quizz data
        document.getElementById('game-area').quizzData = { 'total': 32, 'correct': 0, 'incorrect': 0 };
        // generating a new quizz question
        generateNewRecognitionQuestion();

    } else if (taskType == 'drawing') {
        document.getElementById('game-area').hidden = false;
        document.getElementById('game-area').currentLevel = [chapterIndex, exerciseIndex]
        document.getElementById('game-area').taskLetters = taskLetters
        buttonArea = document.getElementById('button-area');
        // clearing old children
        while (buttonArea.firstChild) {
            buttonArea.removeChild(buttonArea.firstChild);
        }
        // creating buttons / text regions for drawing interactions 

        let p = document.createElement('p');
        p.id = 'drawing-text-area';
        buttonArea.appendChild(p);

        let button = document.createElement('button');
        button.innerHTML = 'Montrer';
        button.id = 'drawing-show-answer';
        button.className = 'quizz-button';
        button.addEventListener('click', showDrawingAnswer)
        buttonArea.appendChild(button);

        button = document.createElement('button');
        button.innerHTML = '&#10003;'
        button.id = 'drawing-correct-answer'
        button.className = 'quizz-button';
        button.disabled = true;
        button.addEventListener('click', validateDrawingAnswer);
        buttonArea.appendChild(button);

        button = document.createElement('button');
        button.innerHTML = '&#10005;';
        button.id = 'drawing-incorrect-answer'
        button.className = 'quizz-button';
        button.disabled = true;
        button.addEventListener('click', validateDrawingAnswer);
        buttonArea.appendChild(button);


        // initializing quizz data
        document.getElementById('game-area').quizzData = { 'total': 32, 'correct': 0, 'incorrect': 0 };
        // generating a new quizz question
        generateNewDrawingQuestion();
    }
}

function updateStarRating(chapterIndex, exerciseIndex, correct) {
    // updates the score rating
    let score
    if (correct == 32) {
        score = 5
    } else if (correct >= 30) {
        score = 4
    } else if (correct >= 28) {
        score = 3
    } else if (correct >= 16) {
        score = 2
    } else if (correct >= 8) {
        score = 1
    } else {
        score = 0
    }
    let previousStars = document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML.split('Score : ')[1]
    let currentScore = REVERSE_STAR_MAPPING[previousStars]
    if (currentScore < score) {
        document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML = 'Score : ' + STAR_MAPPING[score]
    }

}

function generateNewDrawingQuestion() {
    // generates a new question for a drawing task

    let taskLetters = document.getElementById('game-area').taskLetters
    let randomAnswer
    if (document.getElementById('game-area').hasAttributes('answer')) {
        // generate a new random letter that is not the same as the previous one
        let previousValue = document.getElementById('game-area').answer;
        let possibletaskLetters = taskLetters
            .filter(function(value) { return value != previousValue; });
        randomAnswer = possibletaskLetters[randInt(possibletaskLetters
            .length)];

    } else {
        // generate any new random letter the first time we start the game
        randomAnswer = taskLetters[randInt(taskLetters
            .length)];


    }
    // saving the new answer for later
    document.getElementById('game-area').answer = randomAnswer;

    // writing new drawing question
    document.getElementById('drawing-text-area').innerHTML = 'La lettre à dessiner est : ' + randomAnswer;
    updateQuizzProgressBar();

    let sketcher = document.getElementById('game-area').sketcher;
    sketcher.config({ 'interactive': true });
    document.getElementById('drawing-show-answer').disabled = false;
    document.getElementById('drawing-correct-answer').disabled = true;
    document.getElementById('drawing-incorrect-answer').disabled = true;

    clearCanvas();

}

// eslint-disable-next-line no-unused-vars
function showDrawingAnswer(e) {
    // displays the expected letter on the canvas and allows the user to validate his answer
    let quizzData = document.getElementById('game-area').quizzData;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total']) {
        drawLetterOnCanvas(LETTER_MAPPING[document.getElementById('game-area').answer], false);
        document.getElementById('drawing-correct-answer').disabled = false;
        document.getElementById('drawing-incorrect-answer').disabled = false;
        document.getElementById('drawing-show-answer').disabled = true;
    } else {
        updateQuizzProgressBar();
        let chapter, exercise, correct;
        correct = quizzData['correct'];
        updateStarRating(chapter, exercise, correct)
        updateChapterProgress();
    }
}

function validateDrawingAnswer(e) {
    var caller = e.target || e.srcElement;
    if (caller.id == 'drawing-correct-answer') {
        document.getElementById('game-area').quizzData['correct'] += 1;
    } else {
        document.getElementById('game-area').quizzData['incorrect'] += 1;
    }
    generateNewDrawingQuestion();
}

// eslint-disable-next-line no-unused-vars
function updateChapterProgress() {
    /**
     * Updates the HTML headers of each chapters in percentage.
     */
    for (let chapterIndex in LEVELS) {
        let exercicesInChapter = LEVELS[chapterIndex].length;
        let aboveThreeStars = 0;
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let previousStars = document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML.split('Score : ')[1];
            let currentScore = REVERSE_STAR_MAPPING[previousStars]
            if (currentScore > 3) {
                aboveThreeStars += 1;
            }
        }
        document.getElementById(`chapter-progress-${chapterIndex}`).innerHTML = `${Math.round(aboveThreeStars/ exercicesInChapter * 100)}%`
    }
}