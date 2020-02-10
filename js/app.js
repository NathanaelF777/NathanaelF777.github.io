// Global Variables

let accessToken = '';
let currentGame = [];
let questionNumber = 0;
let $nextButton;
let $prevButton;
let $count;
let $category;
let $difficulty;

//Global Functions

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const initButtons = () => {
    $prevButton = $('<button>').text("<").appendTo('.questions');
    $nextButton = $('<button>').text(">").appendTo('.questions');
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
    $('.questions').empty(); //Resets div
    initButtons();
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=' + $count + $category + $difficulty + '&token=' + accessToken
    }).then((data) => {
        currentGame = [];
        for (let i = 0; i < 10; i++) {
            currentGame.push(data.results[i]);
        }
        for (i=0; i < currentGame.length; i++){
            let $newForm = $('<form>').addClass(`question-${i}`);
            $('.questions').append($newForm);
            let $newQuestion = $('<h2>').html(currentGame[i].question).appendTo($newForm);
            let $correctAnswer = $(`<input type="radio" name="question" value="correct" class="correct"> ${currentGame[i].correct_answer}<br>`)
            let currentQuestion = [];
            currentQuestion.push($correctAnswer);
            for (x of currentGame[i].incorrect_answers) {
                let $currentAnswer = $(`<input type="radio" name="question" value="incorrect"> ${x}<br>`)
                currentQuestion.push($currentAnswer);
            }
            shuffleArray(currentQuestion);
            for (x of currentQuestion) {
                $newForm.append(x);
            }
            let $submit = $('<input type="submit" value="submit" disabled=true>').appendTo($newForm);
            $newForm.on('input', (event)=> {
                $submit.attr('disabled', false);
            })
            $newForm.on('submit', (event) => {
                event.preventDefault();
                $submit.attr('disabled', true);
                $newForm.find(':radio:not(:checked)').attr('disabled', true);
                if ($newForm.find(':radio:checked').val() === 'correct') {
                    $(event.currentTarget).addClass('answered-correct');
                } else {
                    $(event.currentTarget).addClass('answered-incorrect');
                }
            })
            $newForm.hide();
        }
        $(`.question-${questionNumber}`).show();
    }, ()=> {
        console.log("F");
    })
}

//Run on Ready
$(()=> {
    $('.close-button').on('click', newModal);
    $('.modal-container').hide();
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
