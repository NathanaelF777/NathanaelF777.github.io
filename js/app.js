// Global Variables

let accessToken = ''

// Acquire access token and store it under accessToken. Will not work immediately on page load.
$.ajax({
    url: 'https://opentdb.com/api_token.php?command=request'
}).then((data) => {
    accessToken = data.token;
}, ()=> {
    console.log("Didn't work.");
