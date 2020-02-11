// Global Variables

let accessToken = '';
let currentGame = [];
let questionNumber = 0;
let $nextButton;
let $prevButton;
let $count;
let $category;
let $difficulty;
let currentScore = 0;
let answeredQuestions = 0;

//Global Functions

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const initButtons = () => {
    $prevButton = $('<button>').text("<").addClass('prev-button').appendTo('.questions');
    $nextButton = $('<button>').text(">").addClass('next-button').appendTo('.questions');
    $nextButton.on('click', nextWindow);
    $prevButton.on('click', prevWindow);
}

const nextWindow = () => {
    $(`.question-${questionNumber}`).hide();
    if (questionNumber < currentGame.length - 1) {
        questionNumber++;
    };
    $(`.question-${questionNumber}`).show();
}

const prevWindow = () => {
    $(`.question-${questionNumber}`).hide();
    if (questionNumber > 0) {
        questionNumber--
    };
    $(`.question-${questionNumber}`).show();
}

const newModal = () => {
    $('.questions').empty();
    $('.modal-form-1').trigger("reset");
    $('.modal-form-2').trigger("reset");
    $('.modal-form-3').trigger("reset");
    $('.modal-container').toggle();
}

const getParam = () => {
    $count = $('.modal-form-1').find(':radio:checked').val();
    $category = $('.modal-form-2').find('option:selected').val();
    $difficulty = $('.modal-form-3').find('option:selected').val();
    console.log('https://opentdb.com/api.php?amount=' + $count + $category + $difficulty + '&token=' + accessToken);
}

const endModalReset = () => {
    $('.end-announcement').empty();
    $('.end-modal-container').hide();
    newModal();
}

// Acquire access token and store it under accessToken. Will not work immediately on page load.
$.ajax({
    url: 'https://opentdb.com/api_token.php?command=request'
}).then((data) => {
    accessToken = data.token;
}, ()=> {
    console.log("Didn't work.");
});

// Creates a new quiz

const newGame = () => {
    getParam();
    newModal();
    currentScore = 0;
    answeredQuestions = 0;
    questionNumber = 0;
    $('.questions').empty(); //Resets div
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=' + $count + $category + $difficulty + '&token=' + accessToken
    }).then((data) => {
        currentGame = [];
        for (let i = 0; i < 10; i++) {
            currentGame.push(data.results[i]);
        }
        for (i=0; i < currentGame.length; i++){
            let $newForm = $('<form>').addClass('question');
            let $newDiv = $('<div>').addClass('question-container').addClass(`question-${i}`);
            $('.questions').append($newDiv);
            let $newQuestion = $('<h2>').html(currentGame[i].question).appendTo($newDiv);
            $($newDiv).append($newForm);
            let $correctAnswer = $(`<label><input type="radio" name="question" value="correct" class="radio correct"/> ${currentGame[i].correct_answer}</label><br>`)
            let currentQuestion = [];
            currentQuestion.push($correctAnswer);
            for (x of currentGame[i].incorrect_answers) {
                let $currentAnswer = $(`<label><input type="radio" name="question" value="incorrect" class="radio" /> ${x}</label><br>`)
                currentQuestion.push($currentAnswer);
            }
            shuffleArray(currentQuestion);
            for (x of currentQuestion) {
                $newForm.append(x);
            }
            let $submit = $('<input type="submit" value="submit" disabled=true class="question-submit">').appendTo($newForm);
            $newForm.on('input', (event)=> {
                $submit.attr('disabled', false);
            })
            $newForm.on('submit', (event) => {
                answeredQuestions++
                event.preventDefault();
                $submit.attr('disabled', true);
                $newForm.find(':radio:not(:checked)').attr('disabled', true);
                if ($newForm.find(':radio:checked').val() === 'correct') {
                    $(event.currentTarget).addClass('answered-correct');
                    currentScore++
                    $newForm.append('<p class="answer-response">Correct!</p>');
                } else {
                    $(event.currentTarget).addClass('answered-incorrect');
                    let $correct = $newForm.find('.correct').parent().text();
                    $newForm.append(`<p class="answer-response">Correct answer: ${$correct}</p>`);
                }
                if (answeredQuestions === currentGame.length) {
                    $('.end-announcement').append(`<h1>You got ${currentScore} out of ${currentGame.length} correct.</p>`)
                    $('.end-modal-container').toggle();
                }
            })
            $newDiv.hide();
        }
        initButtons();
        $(`.question-${questionNumber}`).show();
    }, ()=> {
        console.log("F");
    })
}

//Run on Ready
$(()=> {
    $('.close-button').on('click', newModal);
    $('.reset-button').on('click', endModalReset);
    $('.modal-container').hide();
    $('.end-modal-container').hide();
    $('#new-game').on('click', newModal);
    $('.new-game-submit').on('click', newGame);


})

// old Code
// const newGame = () => {
//     $('.questions').empty(); //Resets div
//     $.ajax({
//         url: 'https://opentdb.com/api.php?amount=10&token=' + accessToken
//     }).then((data) => {
//         currentGame = [];
//         for (let i = 0; i < 10; i++) {
//             currentGame.push(data.results[i]);
//         }
//         currentGame.forEach((item)=>{
//             let $newForm = $('<form>');
//             $('.questions').append($newForm);
//             let $newQuestion = $('<h2>').html(item.question).appendTo($newForm);
//             let $correctAnswer = $(`<input type="radio" name="question" value="correct" class="correct">${item.correct_answer}</input>`)
//             let currentQuestion = [];
//             currentQuestion.push($correctAnswer);
//             for (x of item.incorrect_answers) {
//                 let $currentAnswer = $(`<input type="radio" name="question" value="incorrect">${x}</input>`)
//                 currentQuestion.push($currentAnswer);
//             }
//             shuffleArray(currentQuestion);
//             for (x of currentQuestion) {
//                 $newForm.append(x);
//             }
//             let $submit = $('<input type="submit" value="submit" disabled=true>').appendTo($newForm);
//             $newForm.on('input', (event)=> {
//                 $submit.attr('disabled', false);
//             })
//             $newForm.on('submit', (event) => {
//                 event.preventDefault();
//                 $submit.attr('disabled', true);
//                 $newForm.find(':radio:not(:checked)').attr('disabled', true);
//                 if ($newForm.find(':radio:checked').val() === 'correct') {
//                     $(event.currentTarget).addClass('answered-correct');
//                 } else {
//                     $(event.currentTarget).addClass('answered-incorrect');
//                 }
//             })
//         })
//     }, ()=> {
//         console.log("F");
//     })
// }


// attempt 2 - delete and recreate divs
// const newGame = () => {
//     $('.questions').empty();
//     $.ajax({
//         url: 'https://opentdb.com/api.php?amount=10&token=' + accessToken
//     }).then((data) => {
//         currentGame = [];
//         for (let i = 0; i < 10; i++) {
//             currentGame.push(data.results[i]);
//         }
//         let $newForm = $('<form>');
//         $('.questions').append($newForm);
//         let $newQuestion = $('<h2>').html(currentGame[questionNumber].question).appendTo($newForm);
//         let $correctAnswer = $(`<input type="radio" name="question" value="correct" class="correct">${currentGame[questionNumber].correct_answer}</input>`)
//         let currentQuestion = [];
//         currentQuestion.push($correctAnswer);
//         for (x of currentGame[questionNumber].incorrect_answers) {
//             let $currentAnswer = $(`<input type="radio" name="question" value="incorrect">${x}</input>`)
//             currentQuestion.push($currentAnswer);
//             }
//         shuffleArray(currentQuestion);
//         for (x of currentQuestion) {
//             $newForm.append(x);
//         }
//         let $submit = $('<input type="submit" value="submit" disabled=true>').appendTo($newForm);
//         $newForm.on('input', (event)=> {
//             $submit.attr('disabled', false);
//         })
//         $newForm.on('submit', (event) => {
//             event.preventDefault();
//             $submit.attr('disabled', true);
//             $newForm.find(':radio:not(:checked)').attr('disabled', true);
//             if ($newForm.find(':radio:checked').val() === 'correct') {
//                 $(event.currentTarget).addClass('answered-correct');
//             } else {
//                 $(event.currentTarget).addClass('answered-incorrect');
//             }
//         })
//     }, ()=> {
//         console.log("F");
//     })
// }
