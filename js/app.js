// Global Variables

let accessToken = '';
let currentGame = [];

//Global Functions

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

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
    $('.questions').empty();
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=10&token=' + accessToken
    }).then((data) => {
        currentGame = [];
        for (let i = 0; i < 10; i++) {
            currentGame.push(data.results[i]);
        }
        console.log(currentGame);
        currentGame.forEach((item)=>{
            console.log("is running");
            let $newForm = $('<form>');
            $('.questions').append($newForm);
            let $newQuestion = $('<h2>').html(item.question).appendTo($newForm);
            console.log($newQuestion);
            let $correctAnswer = $(`<input type="radio" name="question" value="correct" class="correct">${item.correct_answer}</input>`)
            console.log($correctAnswer);
            // $newForm.append($correctAnswer);
            let currentQuestion = [];
            currentQuestion.push($correctAnswer);
            for (x of item.incorrect_answers) {
                let $currentAnswer = $(`<input type="radio" name="question" value="incorrect">${x}</input>`)
                currentQuestion.push($currentAnswer);
            }
            shuffleArray(currentQuestion);
            console.log(currentQuestion);
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
                // console.log($(event.target));
                // $(event.target).addClass('clicked');
                $newForm.find(':radio:not(:checked)').attr('disabled', true);
                console.log($newForm.find(':radio:checked').val());
                if ($newForm.find(':radio:checked').val() === 'correct') {
                    $(event.currentTarget).addClass('answered-correct');
                } else {
                    $(event.currentTarget).addClass('answered-incorrect');
                }
            })
        })
    }, ()=> {
        console.log("F");
    })
}

//Run on Ready
$(()=> {
$('#new-game').on('click', newGame);


})
