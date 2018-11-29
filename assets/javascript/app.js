$(document).ready(function() {

// on click events
  $("#remaining-time").hide();
  $("#start").on("click", trivia.startGame);
  $(document).on("click" , ".option", trivia.guessChecker);

});

var correct = 0;
var incorrect = 0;
var unanswered = 0;
var currentSet = 0;
var timer = 20;

var trivia = {

timerOn : false,
timerId : "",

  // questions, choices and answers
  
  questions: {
    q1: "Which one of these authors wrote and illustrated Calvin and Hobbes?",
    q2: "Which of the following has Calvin dressed up as for Halloween?",
    q3: "What is the very first Calvin and Hobbes comic strip about?",
    q4: "What is Calvin's Principal's name?",
    q5: "What is the only part of baseball that Calvin and Hobbes really like?",
    q6: "Where have Calvin and Hobbes never tried to visit?",
    q7: "The character of Calvin is named after which 16th century religious figure?"
  },
  options: {
    q1: ["Tommy Peters", "Charles Schultz", "Bill Watterson", "Jim Davis"],
    q2: ["A tiger", "An onion", "A barrel of toxic waste", "All of these"],
    q3: ["Calvin caught Hobbes with a rigged tuna fish sandwich", "Calvin looks for Hobbes after he goes missing", "Calvin and Hobbes playing in a pile of leaves", "Hobbes ate Calvin's homework"],
    q4: ["Principle Skinner", "Mr. Spittle", "Principal Belding", "Mr. Himbry"],
    q5: ["Stealing bases", "Swinging the bat", "Antagonizing the pitcher", "Kicking Dust"],
    q6: ["Mars", "The Amazon", "The age of dinosaurs", "The Yukon"],
    q7: ["John Calvin Coolidge", "Calvin Abrams", "John Calvin", "Calvin Broadus"]
  },
  answers: {
    q1: "Bill Watterson",
    q2: "A barrel of toxic waste",
    q3: "Calvin caught Hobbes with a rigged tuna fish sandwich",
    q4: "Mr. Spittle",
    q5: "Kicking Dust",
    q6: "The Amazon",
    q7: "John Calvin"
  },

  startGame: function(){

// restart game

    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    // Reset score
    $('#results').html('');
    
    // Show timer on screen
    $('#timer').text(trivia.timer);
    
    // Hide start button
    $('#start').hide();

    // Show remaining time
    $('#remaining-time').show();
    
    // Populate first question
    trivia.nextQuestion();
    
  },

  nextQuestion : function(){
    
    // Set timer to 10 seconds
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // Preventing timer to speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // Record user choices
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // User choices
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },

  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // Unanswered
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // All questions have been answered
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // Tallying each entry
      $('#results')
        .html('<h3>Thanks for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>No Answer: '+ trivia.unanswered +'</p>'+
        '<p>Press the Start button to try again!</p>');
      
      // Hide game from user
      $('#game').hide();
      
      // Show start button to start another game
      $('#start').show();
    }
    
  },

  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // Correct guess
    if($(this).text() === currentAnswer){
      // Button turns green on correct guess
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // Incorrect guess
    else{
      // Button turns red on wrong guess
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // Populate next question
    trivia.nextQuestion();
     
  }

}
