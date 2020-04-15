const STAR_MAPPING = {
    5: '\u2605\u2605\u2605\u2605\u2605',
    4: '\u2605\u2605\u2605\u2605\u2606',
    3: '\u2605\u2605\u2605\u2606\u2606',
    2: '\u2605\u2605\u2606\u2606\u2606',
    1: '\u2605\u2606\u2606\u2606\u2606',
    0: '\u2606\u2606\u2606\u2606\u2606'
}

const REVERSE_STAR_MAPPING = {
    '\u2605\u2605\u2605\u2605\u2605': 5,
    '\u2605\u2605\u2605\u2605\u2606': 4,
    '\u2605\u2605\u2605\u2606\u2606': 3,
    '\u2605\u2605\u2606\u2606\u2606': 2,
    '\u2605\u2606\u2606\u2606\u2606': 1,
    '\u2606\u2606\u2606\u2606\u2606': 0
}

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

var strokesCorrectAnswer = [
    [
        [181, 121],
        [184, 123],
        [185, 126],
        [187, 128],
        [189, 131],
        [192, 134],
        [195, 138],
        [197, 140],
        [199, 143],
        [201, 145],
        [203, 148],
        [205, 149],
        [206, 151],
        [208, 152],
        [209, 154],
        [210, 155],
        [211, 156],
        [213, 158],
        [214, 159],
        [215, 161],
        [216, 161],
        [217, 162],
        [217, 163],
        [218, 163],
        [218, 164],
        [219, 164],
        [219, 162],
        [221, 159],
        [223, 155],
        [225, 151],
        [227, 147],
        [229, 143],
        [230, 139],
        [232, 136],
        [234, 133],
        [236, 129],
        [237, 125],
        [239, 122],
        [243, 117],
        [246, 113],
        [249, 109],
        [252, 104],
        [255, 101],
        [258, 97],
        [260, 93],
        [263, 88],
        [267, 83],
        [270, 78],
        [271, 72],
        [273, 69],
        [275, 64],
        [276, 62],
        [276, 61],
        [277, 60],
        [277, 59],
        [277, 59],
        [277, 59]
    ],
];

var strokesIncorrectAnswer = [
    [
        [176, 62],
        [178, 62],
        [183, 64],
        [188, 69],
        [196, 75],
        [204, 81],
        [218, 92],
        [230, 100],
        [240, 107],
        [249, 113],
        [256, 118],
        [261, 122],
        [267, 128],
        [272, 133],
        [275, 137],
        [277, 141],
        [280, 145],
        [281, 146],
        [282, 148],
        [283, 148],
        [283, 149],
        [283, 149],
        [283, 149],
        [284, 150],
        [286, 151],
        [287, 152],
        [288, 152],
        [289, 153],
        [290, 153],
        [290, 154]
    ],
    [
        [172, 160],
        [172, 159],
        [172, 157],
        [174, 153],
        [177, 149],
        [183, 142],
        [188, 136],
        [192, 131],
        [197, 124],
        [201, 121],
        [205, 116],
        [208, 112],
        [212, 108],
        [216, 104],
        [219, 101],
        [223, 98],
        [227, 94],
        [233, 90],
        [235, 88],
        [240, 84],
        [243, 81],
        [250, 75],
        [256, 70],
        [261, 66],
        [264, 62],
        [269, 58],
        [274, 54],
        [277, 51],
        [280, 48],
        [282, 47],
        [283, 46],
        [283, 46],
        [284, 46]
    ]
]

/* disable scrolling helper functions based on https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily */

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line getter-return
        get: function() { supportsPassive = true; }
    }));
    // eslint-disable-next-line no-empty
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


/**
 * Actual game logic starts here.
 */

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
    let sketcher = document.getElementById('game-area').sketcher;
    sketcher.handler(function(elem, data) {
        data.sketch.beginPath()
            .lineStyle('gray', 3)
            .line(0, 200, 500, 200)
            .stroke()
            .closePath()
    });

}

function drawLetterOnCanvas(randomLetter, clearBeforeDrawing = true) {
    if (clearBeforeDrawing) {
        clearCanvas();
    }
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = "280px Amiri";
    ctx.fillStyle = 'black';
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
            // eslint-disable-next-line no-undef
            let sketcher = new Sketchable(document.getElementById('myCanvas'), {
                graphics: {
                    firstPointSize: 5,
                    lineWidth: 10,
                    strokeStyle: 'green',
                }
            });

            sketcher.strokes(strokesCorrectAnswer)
                .clear(true)
                .animate.strokes()
        } else {
            document.getElementById('game-area').quizzData['incorrect'] += 1;
            // eslint-disable-next-line no-undef
            let sketcher = new Sketchable(document.getElementById('myCanvas'), {
                graphics: {
                    firstPointSize: 5,
                    lineWidth: 10,
                    strokeStyle: 'red',
                }
            });
            sketcher.strokes(strokesIncorrectAnswer)
                .clear(true)
                .animate.strokes()
        }
        setTimeout(generateNewRecognitionQuestion, 1500);

    } else {
        // this exercise is now finished
        finishExercise(quizzData);
    }
}

function finishExercise(quizzData) {
    /**  The game is finished: display dialog and update main interface.
     * 
     * */
    var chapter, exercise, correct, incorrect;
    [correct, incorrect] = [quizzData['correct'], quizzData['incorrect']];
    [chapter, exercise] = document.getElementById('game-area').currentLevel;
    let starScore = updateStarRating(chapter, exercise, correct, incorrect);
    document.getElementById('myCanvas').style.display = "none";
    let infoBox = document.getElementById('canvas-data');
    infoBox.hidden = false;
    infoBox.innerHTML = `Bravo ! Vous venez de finir cet exercice. <br> Vous avez donné ${correct} bonne(s) réponse(s) et ${incorrect} mauvaise(s) réponse(s). <br> Votre score est de ${starScore}.`

    updateQuizzProgressBar();
    updateChapterProgress();
    // if it's a drawing exercise we also disable the bottom buttons
    document.getElementById('drawing-correct-answer').disabled = true;
    document.getElementById('drawing-incorrect-answer').disabled = true;
}

function toggleGameAreaModal() {
    var gameArea = document.getElementById('game-area');

    if (gameArea.className.indexOf('open') > -1) {
        // indexOf returns -1 when the string is not found
        gameArea.className = gameArea.className.replace('open', '');
        enableScroll();
        let sketcher = document.getElementById('game-area').sketcher;
        // deactivate interactive drawing when modal dialog is closed
        sketcher.config({ 'interactive': false })
    } else {
        // the else here means that the string was not found
        gameArea.className = gameArea.className + ' open';
        disableScroll();
    }
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
                var linkNode = document.createElement('button')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                    // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game ' + `start-chapter${chapterIndex}`
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
                linkNode = document.createElement('button')
                linkNode.appendChild(document.createTextNode('Démarrer le niveau !'))
                    // eslint-disable-next-line no-unused-vars
                linkNode.addEventListener('click', function(e) {
                    runLevel(chapterIndex, exerciseIndex)
                })
                linkNode.className = 'start-game ' + `start-chapter${chapterIndex}`;
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
    toggleGameAreaModal();
    document.getElementById('myCanvas').style.display = "block";
    document.getElementById('canvas-data').hidden = true;
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
    let score;
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
    let previousScore = REVERSE_STAR_MAPPING[previousStars]
    if (previousScore < score) {
        document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML = 'Score : ' + STAR_MAPPING[score]
    }
    return STAR_MAPPING[score];
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

    drawLetterOnCanvas(LETTER_MAPPING[document.getElementById('game-area').answer], false);
    document.getElementById('drawing-correct-answer').disabled = false;
    document.getElementById('drawing-incorrect-answer').disabled = false;
    document.getElementById('drawing-show-answer').disabled = true;

}

function validateDrawingAnswer(e) {
    var caller = e.target || e.srcElement;
    if (caller.id == 'drawing-correct-answer') {
        document.getElementById('game-area').quizzData['correct'] += 1;
    } else {
        document.getElementById('game-area').quizzData['incorrect'] += 1;
    }
    let quizzData = document.getElementById('game-area').quizzData;
    if (quizzData['correct'] + quizzData['incorrect'] < quizzData['total']) {
        generateNewDrawingQuestion();
    } else {
        // the game is finished: display dialog and update main interface
        finishExercise(quizzData);
    }
}

// eslint-disable-next-line no-unused-vars
function updateChapterProgress() {
    /**
     * Updates the HTML headers of each chapters in percentage. Also unlocks the chapters as a function of progress.
     */
    var previousChapterCompleted = true;
    for (let chapterIndex in LEVELS) {
        // do the unlocking of chapters based on previous value
        for (let elem of document.getElementsByClassName(`start-chapter${chapterIndex}`)) {
            if (previousChapterCompleted) {
                elem.disabled = false;
            } else {
                elem.disabled = true;
            }
        }
        let exercicesInChapter = LEVELS[chapterIndex].length;
        let aboveThreeStars = 0;
        for (let exerciseIndex in LEVELS[chapterIndex]) {
            let previousStars = document.getElementById(`score-chapter${chapterIndex}-exercise${exerciseIndex}`).innerHTML.split('Score : ')[1];
            let currentScore = REVERSE_STAR_MAPPING[previousStars]
            if (currentScore >= 3) {
                aboveThreeStars += 1;
            }
        }
        // update chapter progress
        document.getElementById(`chapter-progress-${chapterIndex}`).innerHTML = `${Math.round(aboveThreeStars/ exercicesInChapter * 100)}%`;

        // update the completion indicator for setting the next chapters
        if (aboveThreeStars === exercicesInChapter) {
            previousChapterCompleted = true;
        } else {
            previousChapterCompleted = false;
        }
    }
}