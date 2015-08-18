// Create a browser-based, single-player version of Rock Paper Scissors.
// The "computer" should pick a random move each turn.
// Keep a score counter somewhere on the page. Don't worry about styling until you're done with the logic.

(function() {

  var header = document.querySelector('#header');
  var container = document.getElementById('container');
  var gameInfo = document.querySelector('#gameInfo');
  gameInfo.innerHTML = "Nobody has won a round.";
  var score = document.getElementById('score');
  var console = document.getElementById('console');
  console.innerHTML = "Choose rock, paper, or scissors!";
  var userTally = document.querySelector('#user');
  var compTally = document.querySelector('#comp');
  var button = document.querySelector('button');
  var userChoice;
  var computerChoice;
  var userWins;
  var tie;
  var userScore = 0;
  userTally.innerHTML = userScore;
  var compScore = 0;
  compTally.innerHTML = compScore;
  var pending = false;


  container.addEventListener("click", function(event) {
    if (pending) {
      return;
    }
    if (event.target.id === "container") {
      return;
    }
    pending = true;
    gameInfo.innerHTML = '';
    userChoice = event.target.id;
    getOutcome(userChoice);
    logUserResult();
    logCompResult();
    setTimeout(function() {
      showResult();
      updateScore();
      pending = false;
    }, 4000);
  });



  function getOutcome(userChoice) {
    computerChoice = randomChoice();

    if (userChoice === computerChoice) {
      tie = true;
    }
    else if (userChoice === "scissors") {
      if (computerChoice === "rock") {
        userWins = false;
        compScore++;
      }
      else {
        userWins = true;
        userScore++;
      }
    }
    else if (userChoice === "rock") {
      if (computerChoice === "paper") {
        userWins = false;
        compScore++;
      }
      else {
        userWins = true;
        userScore++;
      }
    }
    else if (userChoice === "paper") {
      if (computerChoice === "scissors") {
        userWins = false;
        compScore++;
      }
      else {
        userWins = true;
        userScore++;
      }
    }
  }

  function randomChoice() {
    randomNum = Math.random();
    if (randomNum >= 0.66) {
      return "rock";
    }
    else if (randomNum >= 0.33) {
      return "paper";
    }
    else {
      return "scissors";
    }
  }

  function showResult() {
    if (tie === true) {
      gameInfo.innerHTML = "The result is a tie!";
      tie = false;
    }
    else if (userWins) {
      gameInfo.innerHTML = "You win this round!";
      userWins = false;
    }
    else {
      gameInfo.innerHTML = "The computer wins this round!";
    }
  }

  function logUserResult() {
    console.innerHTML = "You chose " + userChoice + ". ";
  }

  function logCompResult() {
    setTimeout(function () {
      console.innerHTML += "The computer chose";
      setTimeout(function () {
        console.innerHTML += ".";
        setTimeout(function () {
          console.innerHTML += ".";
          setTimeout(function () {
            console.innerHTML += ".";
            setTimeout(function () {
              console.innerHTML += " " + computerChoice + "!";
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 1000);
  }

  function updateScore() {
    userTally.innerHTML = userScore;
    compTally.innerHTML = compScore;
  }

  function reset() {
    console.innerHTML = "Choose rock, paper, or scissors!";
    gameInfo.innerHTML = "Nodoby has won a round.";
    userScore = 0;
    compScore = 0;
    updateScore();
  }

  button.addEventListener("click", function() {
    reset();
  });

})();